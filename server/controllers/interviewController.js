import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Interview from '../models/Interview.js';
import Student from '../models/Student.js';

/**
 * @desc    Get all interview schedules with filters & pagination
 * @route   GET /api/interviews
 * @access  Private
 */
export const getInterviews = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  // If Student, only show their own interviews
  if (req.user.role === 'STUDENT') {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
    if (student) {
      query.student = student._id;
    } else {
      return sendPaginated(res, [], { page, limit, total: 0, totalPages: 1 });
    }
  }

  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.mode && req.query.mode !== 'All') {
    query.mode = new RegExp(req.query.mode, 'i');
  }
  if (req.query.company && req.query.company !== 'All') {
    query.companyName = req.query.company;
  }
  if (req.query.date) {
    query.date = req.query.date;
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { studentName: sRegex },
      { companyName: sRegex },
      { position: sRegex },
      { interviewer: sRegex },
      { round: sRegex }
    ];
  }

  const [interviews, total] = await Promise.all([
    Interview.find(query)
      .sort({ date: 1, startTime: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Interview.countDocuments(query)
  ]);

  const formattedInterviews = interviews.map((i) => ({
    ...i,
    id: i._id.toString()
  }));

  return sendPaginated(res, formattedInterviews, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated interview statistics
 * @route   GET /api/interviews/stats
 * @access  Private
 */
export const getInterviewStats = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === 'STUDENT') {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
    if (student) query.student = student._id;
  }

  const interviews = await Interview.find(query).select('status');
  const total = interviews.length;
  const scheduled = interviews.filter((i) => i.status === 'Scheduled').length;
  const completed = interviews.filter((i) => i.status === 'Completed').length;
  const cancelled = interviews.filter((i) => i.status === 'Cancelled' || i.status === 'Rescheduled').length;

  return sendSuccess(res, {
    total,
    scheduled,
    completed,
    cancelled
  });
});

/**
 * @desc    Get interview by ID
 * @route   GET /api/interviews/:id
 * @access  Private
 */
export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id)
    .populate('student', 'studentId fullName email department deptCode avatar')
    .populate('company', 'name logo website');

  if (!interview) {
    res.status(404);
    throw new Error('Interview slot not found');
  }

  return sendSuccess(res, interview);
});

/**
 * @desc    Schedule new interview round
 * @route   POST /api/interviews
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const scheduleInterview = asyncHandler(async (req, res) => {
  const {
    application,
    company,
    companyName,
    companyLogo,
    student,
    studentName,
    studentDepartment,
    studentAvatar,
    position,
    round,
    date,
    startTime,
    endTime,
    mode,
    meetingLink,
    location,
    interviewer,
    status,
    feedback
  } = req.body;

  if (!companyName || !studentName || !round || !date) {
    res.status(400);
    throw new Error('Company name, student name, round title, and date are required');
  }

  const interviewCount = await Interview.countDocuments();
  const interviewId = `INT${new Date().getFullYear()}-${String(interviewCount + 1).padStart(3, '0')}`;

  const interview = await Interview.create({
    interviewId,
    application: application || undefined,
    company: company || undefined,
    companyName: companyName.trim(),
    companyLogo: companyLogo || '',
    student: student || undefined,
    studentName: studentName.trim(),
    studentDepartment: studentDepartment || '',
    studentAvatar: studentAvatar || '',
    position: position || '',
    round: round.trim(),
    date,
    startTime: startTime || '10:00 AM',
    endTime: endTime || '11:00 AM',
    mode: mode || 'Online',
    meetingLink: meetingLink || '',
    location: location || '',
    interviewer: interviewer || '',
    status: status || 'Scheduled',
    feedback: feedback || ''
  });

  return sendSuccess(res, interview, 'Interview scheduled successfully', 201);
});

/**
 * @desc    Update interview details / status / feedback
 * @route   PUT /api/interviews/:id
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    res.status(404);
    throw new Error('Interview slot not found');
  }

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined) {
      interview[key] = req.body[key];
    }
  });

  const updated = await interview.save();
  return sendSuccess(res, updated, 'Interview updated successfully');
});

/**
 * @desc    Delete interview schedule
 * @route   DELETE /api/interviews/:id
 * @access  Private (ADMIN, TPO)
 */
export const deleteInterview = asyncHandler(async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    res.status(404);
    throw new Error('Interview slot not found');
  }

  await interview.deleteOne();
  return sendSuccess(res, null, 'Interview removed successfully');
});
