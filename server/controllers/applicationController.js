import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import {
  updateStatusService,
  updateStageService
} from '../services/applicationService.js';

/**
 * @desc    Get all applications with filters and pagination
 * @route   GET /api/applications
 * @access  Private
 */
export const getApplications = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  // If Student, only show their own applications
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

  // If HOD, scope to their department
  if (req.user.role === 'HOD' && req.user.department) {
    query.studentDepartment = new RegExp(req.user.department, 'i');
  }

  // Filters
  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.stage && req.query.stage !== 'All') {
    query.currentStage = req.query.stage;
  }
  if (req.query.department && req.query.department !== 'All') {
    query.studentDepartment = req.query.department;
  }
  if (req.query.company && req.query.company !== 'All') {
    query.companyName = req.query.company;
  }
  if (req.query.driveId && req.query.driveId !== 'All') {
    query.$or = [{ driveId: req.query.driveId }, { drive: req.query.driveId }];
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { studentName: sRegex },
      { companyName: sRegex },
      { position: sRegex },
      { applicationId: sRegex },
      { studentEmail: sRegex }
    ];
  }

  const [applications, total] = await Promise.all([
    Application.find(query)
      .populate('student', 'studentId fullName email department deptCode cgpa backlogs avatar resumeUrl')
      .populate('drive', 'driveId title ctc location applicationDeadline status')
      .sort({ appliedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Application.countDocuments(query)
  ]);

  const formattedApplications = applications.map((a) => ({
    ...a,
    id: a._id.toString()
  }));

  return sendPaginated(res, formattedApplications, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated application stats
 * @route   GET /api/applications/stats
 * @access  Private
 */
export const getApplicationStats = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === 'STUDENT') {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
    if (student) query.student = student._id;
  }

  const applications = await Application.find(query).select('status');
  const total = applications.length;
  const underReview = applications.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const selected = applications.filter((a) => a.status === 'Selected').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  return sendSuccess(res, {
    total,
    underReview,
    shortlisted,
    selected,
    rejected
  });
});

/**
 * @desc    Get application by ID
 * @route   GET /api/applications/:id
 * @access  Private
 */
export const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let application;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    application = await Application.findById(id)
      .populate('student', 'studentId firstName lastName fullName email phone department deptCode cgpa backlogs skills resumeUrl github linkedin')
      .populate('drive', 'driveId title companyName ctc jobType location eligibility selectionProcess description');
  } else {
    application = await Application.findOne({ applicationId: id.toUpperCase() })
      .populate('student', 'studentId firstName lastName fullName email phone department deptCode cgpa backlogs skills resumeUrl github linkedin')
      .populate('drive', 'driveId title companyName ctc jobType location eligibility selectionProcess description');
  }

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  return sendSuccess(res, application);
});

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let appId = id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const app = await Application.findOne({ applicationId: id.toUpperCase() });
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }
    appId = app._id;
  }

  const updated = await updateStatusService(appId, req.body);
  return sendSuccess(res, updated, 'Application status updated successfully');
});

/**
 * @desc    Update application recruitment stage
 * @route   PUT /api/applications/:id/stage
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const updateApplicationStage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let appId = id;

  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const app = await Application.findOne({ applicationId: id.toUpperCase() });
    if (!app) {
      res.status(404);
      throw new Error('Application not found');
    }
    appId = app._id;
  }

  const updated = await updateStageService(appId, req.body);
  return sendSuccess(res, updated, 'Application stage updated successfully');
});

/**
 * @desc    Withdraw application (Student action)
 * @route   PUT /api/applications/:id/withdraw
 * @access  Private (STUDENT, ADMIN)
 */
export const withdrawApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let application;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    application = await Application.findById(id);
  } else {
    application = await Application.findOne({ applicationId: id.toUpperCase() });
  }

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  if (application.status === 'Selected') {
    res.status(400);
    throw new Error('Cannot withdraw an accepted or selected application');
  }

  application.status = 'Withdrawn';
  application.notes = req.body.notes || 'Withdrawn by candidate';
  await application.save();

  return sendSuccess(res, application, 'Application withdrawn successfully');
});

/**
 * @desc    Delete application
 * @route   DELETE /api/applications/:id
 * @access  Private (ADMIN)
 */
export const deleteApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let application;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    application = await Application.findById(id);
  } else {
    application = await Application.findOne({ applicationId: id.toUpperCase() });
  }

  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }

  await application.deleteOne();
  return sendSuccess(res, null, 'Application record deleted successfully');
});
