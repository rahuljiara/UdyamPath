import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import Department from '../models/Department.js';
import Student from '../models/Student.js';
import Placement from '../models/Placement.js';

/**
 * @desc    Get all departments
 * @route   GET /api/departments
 * @access  Public / Authenticated
 */
export const getDepartments = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.status === 'active') {
    query.isActive = true;
  }
  if (req.query.search) {
    const regex = new RegExp(req.query.search, 'i');
    query.$or = [{ name: regex }, { code: regex }, { hod: regex }];
  }

  const departments = await Department.find(query).sort({ name: 1 });
  return sendSuccess(res, departments);
});

/**
 * @desc    Get department by ID or Code
 * @route   GET /api/departments/:id
 * @access  Public / Authenticated
 */
export const getDepartmentById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({
      $or: [{ code: id.toUpperCase() }, { name: new RegExp(`^${id}$`, 'i') }]
    });
  }

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  return sendSuccess(res, department);
});

/**
 * @desc    Create new department
 * @route   POST /api/departments
 * @access  Private (ADMIN, TPO)
 */
export const createDepartment = asyncHandler(async (req, res) => {
  const { name, code, hod, description, studentCount } = req.body;

  if (!name || !code) {
    res.status(400);
    throw new Error('Department name and branch code are required');
  }

  const existing = await Department.findOne({
    $or: [{ code: code.toUpperCase().trim() }, { name: name.trim() }]
  });
  if (existing) {
    res.status(409);
    throw new Error('A department with this code or name already exists');
  }

  const department = await Department.create({
    name: name.trim(),
    code: code.toUpperCase().trim(),
    hod: hod ? hod.trim() : '',
    description: description || '',
    studentCount: Number(studentCount) || 0,
    isActive: true
  });

  return sendSuccess(res, department, 'Department created successfully', 201);
});

/**
 * @desc    Update department
 * @route   PUT /api/departments/:id
 * @access  Private (ADMIN, TPO, HOD)
 */
export const updateDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ code: id.toUpperCase() });
  }

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  // If HOD, verify they only update their own department
  if (req.user.role === 'HOD') {
    // Check if user department matches
    const userDept = req.user.department || '';
    if (
      userDept &&
      !department.name.toLowerCase().includes(userDept.toLowerCase()) &&
      department.code.toLowerCase() !== userDept.toLowerCase()
    ) {
      res.status(403);
      throw new Error('Forbidden: HOD can only update their own department');
    }
  }

  const { name, code, hod, description, studentCount, isActive, placedStudents, averagePackage, highestPackage } = req.body;

  if (name) department.name = name.trim();
  if (code) department.code = code.toUpperCase().trim();
  if (hod !== undefined) department.hod = hod;
  if (description !== undefined) department.description = description;
  if (studentCount !== undefined) department.studentCount = Number(studentCount);
  if (placedStudents !== undefined) department.placedStudents = Number(placedStudents);
  if (averagePackage !== undefined) department.averagePackage = averagePackage;
  if (highestPackage !== undefined) department.highestPackage = highestPackage;
  if (isActive !== undefined) department.isActive = isActive;

  const updated = await department.save();
  return sendSuccess(res, updated, 'Department updated successfully');
});

/**
 * @desc    Delete (soft-delete) department
 * @route   DELETE /api/departments/:id
 * @access  Private (ADMIN)
 */
export const deleteDepartment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ code: id.toUpperCase() });
  }

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  department.isActive = false;
  await department.save();

  return sendSuccess(res, null, 'Department deactivated successfully');
});

/**
 * @desc    Get students belonging to department
 * @route   GET /api/departments/:id/students
 * @access  Private (ADMIN, TPO, HOD)
 */
export const getDepartmentStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ code: id.toUpperCase() });
  }

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  const students = await Student.find({
    $or: [{ deptCode: department.code }, { department: department.name }]
  }).sort({ studentId: 1 });

  return sendSuccess(res, students);
});

/**
 * @desc    Get analytics for department
 * @route   GET /api/departments/:id/analytics
 * @access  Private (ADMIN, TPO, HOD)
 */
export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let department;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    department = await Department.findById(id);
  } else {
    department = await Department.findOne({ code: id.toUpperCase() });
  }

  if (!department) {
    res.status(404);
    throw new Error('Department not found');
  }

  const deptQuery = {
    $or: [{ deptCode: department.code }, { department: department.name }]
  };

  const [totalStudents, placedStudents, eligibleStudents] = await Promise.all([
    Student.countDocuments(deptQuery),
    Student.countDocuments({ ...deptQuery, placementStatus: 'Placed' }),
    Student.countDocuments({ ...deptQuery, isEligible: true })
  ]);

  const placementRate = totalStudents > 0
    ? `${((placedStudents / totalStudents) * 100).toFixed(1)}%`
    : '0%';

  return sendSuccess(res, {
    department: department.name,
    code: department.code,
    hod: department.hod,
    totalStudents,
    eligibleStudents,
    placedStudents,
    unplacedStudents: Math.max(0, totalStudents - placedStudents),
    placementRate,
    averagePackage: department.averagePackage,
    highestPackage: department.highestPackage
  });
});
