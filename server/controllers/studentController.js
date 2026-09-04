import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import Application from '../models/Application.js';
import Placement from '../models/Placement.js';

/**
 * @desc    Get all students with filters, search, and pagination
 * @route   GET /api/students
 * @access  Private (ADMIN, TPO, HOD)
 */
export const getStudents = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  // HOD scope constraint
  if (req.user && req.user.role === 'HOD' && req.user.department) {
    query.$or = [
      { deptCode: req.user.department },
      { department: new RegExp(req.user.department, 'i') }
    ];
  }

  // Query parameter filters
  if (req.query.department && req.query.department !== 'All') {
    query.$or = [
      { deptCode: req.query.department },
      { department: new RegExp(req.query.department, 'i') }
    ];
  }

  if (req.query.batch && req.query.batch !== 'All') {
    query.batch = req.query.batch;
  }

  if (req.query.status && req.query.status !== 'All') {
    query.placementStatus = req.query.status;
  }

  if (req.query.isEligible !== undefined) {
    query.isEligible = req.query.isEligible === 'true';
  }

  // Search filter
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$and = query.$and || [];
    query.$and.push({
      $or: [
        { firstName: sRegex },
        { lastName: sRegex },
        { fullName: sRegex },
        { studentId: sRegex },
        { email: sRegex },
        { skills: sRegex },
        { placedCompany: sRegex }
      ]
    });
  }

  const [students, total] = await Promise.all([
    Student.find(query)
      .sort({ studentId: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Student.countDocuments(query)
  ]);

  // Format with virtual id for client compatibility
  const formattedStudents = students.map((s) => ({
    ...s,
    id: s._id.toString()
  }));

  return sendPaginated(res, formattedStudents, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated student stats
 * @route   GET /api/students/stats
 * @access  Private (ADMIN, TPO, HOD)
 */
export const getStudentStats = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user && req.user.role === 'HOD' && req.user.department) {
    query.$or = [
      { deptCode: req.user.department },
      { department: new RegExp(req.user.department, 'i') }
    ];
  }

  const students = await Student.find(query).select('placementStatus isEligible cgpa');
  const total = students.length;
  const placed = students.filter((s) => s.placementStatus === 'Placed').length;
  const eligible = students.filter((s) => s.isEligible).length;
  const totalCgpa = students.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0);
  const avgCgpa = total > 0 ? (totalCgpa / total).toFixed(2) : '0.00';
  const placementRate = total > 0 ? `${((placed / total) * 100).toFixed(1)}%` : '0%';

  return sendSuccess(res, {
    total,
    placed,
    eligible,
    unplaced: Math.max(0, total - placed),
    avgCgpa,
    placementRate
  });
});

/**
 * @desc    Get student by ID or Roll Number
 * @route   GET /api/students/:id
 * @access  Private (ADMIN, TPO, HOD, STUDENT)
 */
export const getStudentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let student;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(id);
  } else {
    student = await Student.findOne({
      $or: [{ studentId: id.toUpperCase() }, { email: id.toLowerCase() }]
    });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  // Security & Ownership checks
  if (req.user.role === 'STUDENT') {
    const isOwnRecord =
      (student.user && student.user.toString() === req.user._id.toString()) ||
      student.email.toLowerCase() === req.user.email.toLowerCase();

    if (!isOwnRecord) {
      res.status(403);
      throw new Error('Forbidden: You can only view your own student profile');
    }
  }

  if (req.user.role === 'HOD' && req.user.department) {
    const deptMatch =
      student.deptCode === req.user.department ||
      student.department.toLowerCase().includes(req.user.department.toLowerCase());
    if (!deptMatch) {
      res.status(403);
      throw new Error('Forbidden: HOD can only view students within their department');
    }
  }

  return sendSuccess(res, student);
});

/**
 * @desc    Create new student
 * @route   POST /api/students
 * @access  Private (ADMIN, TPO, HOD)
 */
export const createStudent = asyncHandler(async (req, res) => {
  const {
    studentId,
    firstName,
    lastName,
    email,
    phone,
    dateOfBirth,
    gender,
    department,
    deptCode,
    course,
    batch,
    semester,
    cgpa,
    backlogs,
    skills,
    programmingLanguages,
    resumeUrl,
    github,
    linkedin,
    portfolio,
    placementStatus,
    avatar
  } = req.body;

  const existing = await Student.findOne({
    $or: [{ studentId: studentId.toUpperCase().trim() }, { email: email.toLowerCase().trim() }]
  });
  if (existing) {
    res.status(409);
    throw new Error('A student with this Student ID or Email already exists');
  }

  const parsedSkills = Array.isArray(skills)
    ? skills
    : typeof skills === 'string'
    ? skills.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const parsedLanguages = Array.isArray(programmingLanguages)
    ? programmingLanguages
    : typeof programmingLanguages === 'string'
    ? programmingLanguages.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const numCgpa = Number(cgpa) || 0;
  const numBacklogs = Number(backlogs) || 0;
  const isEligible = numBacklogs === 0 && numCgpa >= 6.0;

  const student = await Student.create({
    studentId: studentId.toUpperCase().trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    fullName: `${firstName} ${lastName}`.trim(),
    email: email.toLowerCase().trim(),
    phone: phone || '',
    dateOfBirth: dateOfBirth || '',
    gender: gender || 'Male',
    department: department.trim(),
    deptCode: deptCode ? deptCode.toUpperCase().trim() : '',
    course: course || 'B.Tech',
    batch: batch || '2021-2025',
    semester: Number(semester) || 8,
    cgpa: numCgpa,
    backlogs: numBacklogs,
    skills: parsedSkills,
    programmingLanguages: parsedLanguages,
    resumeUrl: resumeUrl || '',
    github: github || '',
    linkedin: linkedin || '',
    portfolio: portfolio || '',
    placementStatus: placementStatus || (isEligible ? 'Seeking' : 'Ineligible'),
    isEligible,
    avatar: avatar || ''
  });

  return sendSuccess(res, student, 'Student created successfully', 201);
});

/**
 * @desc    Update student profile
 * @route   PUT /api/students/:id
 * @access  Private (ADMIN, TPO, HOD, STUDENT)
 */
export const updateStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let student;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(id);
  } else {
    student = await Student.findOne({ studentId: id.toUpperCase() });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const isStudent = req.user.role === 'STUDENT';

  // If student is updating, verify ownership and prevent modifying protected fields
  if (isStudent) {
    const isOwnRecord =
      (student.user && student.user.toString() === req.user._id.toString()) ||
      student.email.toLowerCase() === req.user.email.toLowerCase();

    if (!isOwnRecord) {
      res.status(403);
      throw new Error('Forbidden: You can only edit your own profile');
    }
  }

  const allowedStudentUpdates = [
    'phone',
    'skills',
    'programmingLanguages',
    'resumeUrl',
    'github',
    'linkedin',
    'portfolio',
    'avatar'
  ];

  // Apply updates
  Object.keys(req.body).forEach((key) => {
    // If student, restrict to allowed fields
    if (isStudent && !allowedStudentUpdates.includes(key)) {
      return; // Skip protected fields like cgpa, backlogs, placementStatus, role
    }

    if (key === 'skills' || key === 'programmingLanguages') {
      student[key] = Array.isArray(req.body[key])
        ? req.body[key]
        : typeof req.body[key] === 'string'
        ? req.body[key].split(',').map((s) => s.trim()).filter(Boolean)
        : student[key];
    } else if (key === 'firstName' || key === 'lastName') {
      student[key] = req.body[key];
      student.fullName = `${student.firstName} ${student.lastName}`.trim();
    } else if (req.body[key] !== undefined) {
      student[key] = req.body[key];
    }
  });

  const updated = await student.save();
  return sendSuccess(res, updated, 'Student updated successfully');
});

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private (ADMIN, TPO)
 */
export const deleteStudent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let student;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(id);
  } else {
    student = await Student.findOne({ studentId: id.toUpperCase() });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  await student.deleteOne();
  return sendSuccess(res, null, 'Student removed successfully');
});

/**
 * @desc    Get student applications
 * @route   GET /api/students/:id/applications
 * @access  Private (ADMIN, TPO, HOD, STUDENT)
 */
export const getStudentApplications = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let student;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(id);
  } else {
    student = await Student.findOne({ studentId: id.toUpperCase() });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const applications = await Application.find({ student: student._id }).sort({ appliedAt: -1 });
  return sendSuccess(res, applications);
});

/**
 * @desc    Get student placements
 * @route   GET /api/students/:id/placements
 * @access  Private (ADMIN, TPO, HOD, STUDENT)
 */
export const getStudentPlacements = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let student;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    student = await Student.findById(id);
  } else {
    student = await Student.findOne({ studentId: id.toUpperCase() });
  }

  if (!student) {
    res.status(404);
    throw new Error('Student not found');
  }

  const placements = await Placement.find({ student: student._id });
  return sendSuccess(res, placements);
});
