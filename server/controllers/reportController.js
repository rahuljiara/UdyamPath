import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import Student from '../models/Student.js';
import Company from '../models/Company.js';
import Department from '../models/Department.js';

/**
 * @desc    Generate structured report data matching frontend requirements
 * @route   GET /api/reports/data
 * @access  Private (ADMIN, TPO, HOD)
 */
export const getReportData = asyncHandler(async (req, res) => {
  const {
    reportType = 'summary',
    department = 'All',
    batch = '2021-2025',
    minCgpa = 0
  } = req.query;

  const query = {};
  if (department !== 'All') {
    query.$or = [{ deptCode: department }, { department: new RegExp(department, 'i') }];
  }
  if (batch !== 'All') {
    query.batch = batch;
  }
  if (Number(minCgpa) > 0) {
    query.cgpa = { $gte: Number(minCgpa) };
  }

  // 1. Unplaced Candidates Report
  if (reportType === 'unplaced') {
    const unplacedStudents = await Student.find({
      ...query,
      placementStatus: { $in: ['Unplaced', 'Seeking', 'Not Placed', 'Applied'] }
    }).sort({ studentId: 1 });

    return sendSuccess(res, {
      type: 'Unplaced Candidates Report',
      totalRecords: unplacedStudents.length,
      headers: ['Roll Number', 'Full Name', 'Department', 'CGPA', 'Backlogs', 'Primary Skills', 'Email'],
      rows: unplacedStudents.map((s) => [
        s.studentId,
        s.fullName,
        s.deptCode || s.department,
        s.cgpa,
        s.backlogs,
        Array.isArray(s.skills) ? s.skills.join(', ') : s.skills,
        s.email
      ])
    });
  }

  // 2. Company / Recruiter Report
  if (reportType === 'company') {
    const companies = await Company.find().sort({ totalHires: -1 });
    return sendSuccess(res, {
      type: 'Recruiter Performance Report',
      totalRecords: companies.length,
      headers: ['Company Name', 'Tier Category', 'Industry Sector', 'Total Drives', 'Offers Made', 'Average Package'],
      rows: companies.map((c) => [
        c.name,
        c.tier || 'Tier 1',
        c.industry || 'IT & Software',
        c.activeDrivesCount || 1,
        c.totalHires || 10,
        c.averagePackage || '8.0 LPA'
      ])
    });
  }

  // 3. Department Placement Audit (NIRF/NAAC compliant)
  if (reportType === 'department') {
    const departments = await Department.find().sort({ code: 1 });
    const rows = departments.map((d) => {
      const rate = d.studentCount > 0 ? `${((d.placedStudents / d.studentCount) * 100).toFixed(1)}%` : '0%';
      return [d.name, d.code, d.studentCount, d.placedStudents, rate, d.averagePackage, d.highestPackage];
    });

    return sendSuccess(res, {
      type: 'Department-wise Placement Audit (NAAC/NIRF Format)',
      totalRecords: rows.length,
      headers: ['Department Name', 'Branch Code', 'Total Enrolled', 'Total Placed', 'Placement Rate', 'Average Package', 'Highest Package'],
      rows
    });
  }

  // 4. Default: Placement Summary & Placed Candidates
  const placedStudents = await Student.find({
    ...query,
    placementStatus: 'Placed'
  }).sort({ studentId: 1 });

  return sendSuccess(res, {
    type: 'Campus Placement Summary & Offers Report',
    totalRecords: placedStudents.length,
    headers: ['Roll Number', 'Student Name', 'Department', 'CGPA', 'Hiring Company', 'Designation', 'Package (CTC)'],
    rows: placedStudents.map((s) => [
      s.studentId,
      s.fullName,
      s.deptCode || s.department,
      s.cgpa,
      s.placedCompany || 'Campus Recruiter',
      'Software Engineer',
      s.placedPackage || '8.5 LPA'
    ])
  });
});
