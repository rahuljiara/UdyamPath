import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Application from '../models/Application.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import { isStudentEligible } from '../services/driveService.js';

/**
 * @desc    Get all placement drives with filters, search, and pagination
 * @route   GET /api/drives
 * @access  Private / Public
 */
export const getDrives = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.company && req.query.company !== 'All') {
    query.$or = [{ companyName: req.query.company }, { company: req.query.company }];
  }
  if (req.query.jobType && req.query.jobType !== 'All') {
    query.jobType = req.query.jobType;
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { title: sRegex },
      { companyName: sRegex },
      { driveId: sRegex },
      { location: sRegex }
    ];
  }

  const [drives, total] = await Promise.all([
    PlacementDrive.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    PlacementDrive.countDocuments(query)
  ]);

  const formattedDrives = drives.map((d) => ({
    ...d,
    id: d._id.toString()
  }));

  return sendPaginated(res, formattedDrives, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated placement drive stats
 * @route   GET /api/drives/stats
 * @access  Private
 */
export const getDriveStats = asyncHandler(async (req, res) => {
  const drives = await PlacementDrive.find().select('status openings applicationsCount');
  const totalDrives = drives.length;
  const activeDrives = drives.filter((d) => d.status === 'Open' || d.status === 'In Progress').length;
  const totalOpenings = drives.reduce((sum, d) => sum + (d.openings || 0), 0);
  const totalApplications = drives.reduce((sum, d) => sum + (d.applicationsCount || 0), 0);

  return sendSuccess(res, {
    totalDrives,
    activeDrives,
    totalOpenings,
    totalApplications
  });
});

/**
 * @desc    Get placement drive by ID
 * @route   GET /api/drives/:id
 * @access  Private / Public
 */
export const getDriveById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id).populate('company', 'name logo website industry tier');
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() }).populate('company', 'name logo website industry tier');
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  return sendSuccess(res, drive);
});

/**
 * @desc    Create new placement drive
 * @route   POST /api/drives
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const createDrive = asyncHandler(async (req, res) => {
  const {
    driveId,
    companyId,
    companyName,
    companyLogo,
    title,
    description,
    jobType,
    location,
    salary,
    salaryBreakup,
    ctc,
    openings,
    applicationDeadline,
    driveDate,
    eligibility,
    selectionProcess,
    status
  } = req.body;

  let companyDoc;
  if (companyId) {
    companyDoc = await Company.findById(companyId);
  } else if (companyName) {
    companyDoc = await Company.findOne({ name: new RegExp(`^${companyName}$`, 'i') });
  }

  const finalDriveId =
    driveId || `DRV${new Date().getFullYear()}${String((await PlacementDrive.countDocuments()) + 1).padStart(2, '0')}`;

  const existing = await PlacementDrive.findOne({ driveId: finalDriveId.toUpperCase() });
  if (existing) {
    res.status(409);
    throw new Error('Drive ID already exists');
  }

  const drive = await PlacementDrive.create({
    driveId: finalDriveId.toUpperCase().trim(),
    company: companyDoc ? companyDoc._id : undefined,
    companyName: companyName || (companyDoc ? companyDoc.name : 'Recruiter'),
    companyLogo: companyLogo || (companyDoc ? companyDoc.logo : ''),
    title: title.trim(),
    description: description || '',
    jobType: jobType || 'Full-Time',
    location: location || '',
    salary: salary || '',
    salaryBreakup: salaryBreakup || '',
    ctc: ctc.trim(),
    openings: Number(openings) || 1,
    applicationsCount: 0,
    shortlistedCount: 0,
    applicationDeadline: new Date(applicationDeadline),
    driveDate: driveDate || '',
    eligibility: {
      minCgpa: Number(eligibility?.minCgpa) || 6.0,
      maxBacklogs: Number(eligibility?.maxBacklogs) || 0,
      departments: Array.isArray(eligibility?.departments)
        ? eligibility.departments
        : ['Computer Science & Engineering', 'Information Technology'],
      courses: Array.isArray(eligibility?.courses) ? eligibility.courses : ['B.Tech'],
      batches: Array.isArray(eligibility?.batches) ? eligibility.batches : ['2021-2025'],
      requiredSkills: Array.isArray(eligibility?.requiredSkills) ? eligibility.requiredSkills : []
    },
    selectionProcess: Array.isArray(selectionProcess)
      ? selectionProcess
      : typeof selectionProcess === 'string'
      ? selectionProcess.split('\n').map((s) => s.trim()).filter(Boolean)
      : ['Online Assessment', 'Technical Interview', 'HR Interview'],
    status: status || 'Open',
    createdBy: req.user ? req.user._id : undefined
  });

  // Increment company active drive count
  if (companyDoc) {
    companyDoc.activeDrivesCount = (companyDoc.activeDrivesCount || 0) + 1;
    await companyDoc.save();
  }

  return sendSuccess(res, drive, 'Placement drive created successfully', 201);
});

/**
 * @desc    Update placement drive
 * @route   PUT /api/drives/:id
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const updateDrive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  Object.keys(req.body).forEach((key) => {
    if (key === 'eligibility' && typeof req.body.eligibility === 'object') {
      drive.eligibility = {
        ...drive.eligibility,
        ...req.body.eligibility
      };
    } else if (req.body[key] !== undefined) {
      drive[key] = req.body[key];
    }
  });

  const updated = await drive.save();
  return sendSuccess(res, updated, 'Placement drive updated successfully');
});

/**
 * @desc    Delete placement drive
 * @route   DELETE /api/drives/:id
 * @access  Private (ADMIN, TPO)
 */
export const deleteDrive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  drive.status = 'Cancelled';
  await drive.save();

  return sendSuccess(res, null, 'Placement drive cancelled successfully');
});

/**
 * @desc    Apply to placement drive (Student workflow)
 * @route   POST /api/drives/:id/apply
 * @access  Private (STUDENT, ADMIN, TPO)
 */
export const applyToDrive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  // 1. Verify Drive Status
  if (drive.status !== 'Open') {
    res.status(400);
    throw new Error(`Drive is not accepting applications (Status: ${drive.status})`);
  }

  // 2. Verify Application Deadline
  if (drive.applicationDeadline && new Date() > new Date(drive.applicationDeadline)) {
    res.status(400);
    throw new Error('Application deadline has passed for this placement drive');
  }

  // 3. Find Student Record
  let student;
  if (req.user.role === 'STUDENT') {
    student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
  } else if (req.body.studentId) {
    student = await Student.findOne({
      $or: [{ _id: req.body.studentId }, { studentId: req.body.studentId.toUpperCase() }]
    });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student profile not found. Please complete your student profile first.');
  }

  // 4. Verify Eligibility
  const eligibilityResult = isStudentEligible(student, drive);
  if (!eligibilityResult.eligible) {
    res.status(400);
    throw new Error(`Student is not eligible for this drive: ${eligibilityResult.reasons.join('; ')}`);
  }

  // 5. Verify Duplicate Application
  const existingApp = await Application.findOne({
    student: student._id,
    drive: drive._id
  });

  if (existingApp) {
    res.status(409);
    throw new Error('You have already submitted an application for this placement drive');
  }

  // 6. Create Application
  const appCount = await Application.countDocuments();
  const applicationId = `APP${new Date().getFullYear()}-${String(appCount + 1).padStart(3, '0')}`;

  const newApplication = await Application.create({
    applicationId,
    student: student._id,
    studentName: student.fullName,
    studentEmail: student.email,
    studentDepartment: student.deptCode || student.department,
    studentCgpa: student.cgpa,
    studentAvatar: student.avatar,
    drive: drive._id,
    driveId: drive.driveId,
    companyName: drive.companyName,
    position: drive.title,
    appliedAt: new Date(),
    currentStage: 'Application',
    status: 'Applied',
    notes: req.body.notes || 'Applied through candidate portal.'
  });

  // Increment drive application count
  drive.applicationsCount = (drive.applicationsCount || 0) + 1;
  await drive.save();

  // If student was seeking, update to Applied
  if (student.placementStatus === 'Seeking' || student.placementStatus === 'Unplaced') {
    student.placementStatus = 'Applied';
    await student.save();
  }

  return sendSuccess(res, newApplication, 'Application submitted successfully', 201);
});

/**
 * @desc    Get applications for a drive
 * @route   GET /api/drives/:id/applications
 * @access  Private (ADMIN, TPO, RECRUITER, HOD)
 */
export const getDriveApplications = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const applications = await Application.find({ drive: drive._id })
    .populate('student', 'studentId fullName email department deptCode cgpa backlogs skills resumeUrl')
    .sort({ appliedAt: -1 });

  return sendSuccess(res, applications);
});

/**
 * @desc    Get shortlisted applications for drive
 * @route   GET /api/drives/:id/shortlisted
 * @access  Private (ADMIN, TPO, RECRUITER, HOD)
 */
export const getDriveShortlisted = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const applications = await Application.find({
    drive: drive._id,
    status: 'Shortlisted'
  }).populate('student', 'studentId fullName email department deptCode cgpa backlogs skills resumeUrl');

  return sendSuccess(res, applications);
});

/**
 * @desc    Get selected candidates for drive
 * @route   GET /api/drives/:id/selected
 * @access  Private (ADMIN, TPO, RECRUITER, HOD)
 */
export const getDriveSelected = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let drive;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    drive = await PlacementDrive.findById(id);
  } else {
    drive = await PlacementDrive.findOne({ driveId: id.toUpperCase() });
  }

  if (!drive) {
    res.status(404);
    throw new Error('Placement drive not found');
  }

  const applications = await Application.find({
    drive: drive._id,
    status: 'Selected'
  }).populate('student', 'studentId fullName email department deptCode cgpa placedPackage avatar');

  return sendSuccess(res, applications);
});
