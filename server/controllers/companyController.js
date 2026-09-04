import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Company from '../models/Company.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Student from '../models/Student.js';

/**
 * @desc    Get all companies with filters & pagination
 * @route   GET /api/companies
 * @access  Private (ADMIN, TPO, HOD, RECRUITER)
 */
export const getCompanies = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.industry && req.query.industry !== 'All') {
    query.industry = req.query.industry;
  }
  if (req.query.type && req.query.type !== 'All') {
    query.type = req.query.type;
  }
  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { name: sRegex },
      { companyId: sRegex },
      { industry: sRegex },
      { city: sRegex },
      { location: sRegex }
    ];
  }

  const [companies, total] = await Promise.all([
    Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Company.countDocuments(query)
  ]);

  const formattedCompanies = companies.map((c) => ({
    ...c,
    id: c._id.toString()
  }));

  return sendPaginated(res, formattedCompanies, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated company stats
 * @route   GET /api/companies/stats
 * @access  Private
 */
export const getCompanyStats = asyncHandler(async (req, res) => {
  const companies = await Company.find().select('status totalHires activeDrivesCount');
  const totalCompanies = companies.length;
  const activeCompanies = companies.filter((c) => c.status === 'Active').length;
  const totalHires = companies.reduce((sum, c) => sum + (c.totalHires || 0), 0);
  const activeDrivesCount = await PlacementDrive.countDocuments({
    status: { $in: ['Open', 'In Progress'] }
  });

  return sendSuccess(res, {
    totalCompanies,
    activeCompanies,
    totalHires,
    activeDrivesCount
  });
});

/**
 * @desc    Get company by ID
 * @route   GET /api/companies/:id
 * @access  Private
 */
export const getCompanyById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let company;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    company = await Company.findById(id);
  } else {
    company = await Company.findOne({
      $or: [{ companyId: id.toUpperCase() }, { name: new RegExp(`^${id}$`, 'i') }]
    });
  }

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  return sendSuccess(res, company);
});

/**
 * @desc    Get drives associated with company
 * @route   GET /api/companies/:id/drives
 * @access  Private
 */
export const getCompanyDrives = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let company;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    company = await Company.findById(id);
  } else {
    company = await Company.findOne({ companyId: id.toUpperCase() });
  }

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  const drives = await PlacementDrive.find({
    $or: [{ company: company._id }, { companyName: company.name }]
  }).sort({ createdAt: -1 });

  return sendSuccess(res, drives);
});

/**
 * @desc    Get students placed at company
 * @route   GET /api/companies/:id/placements
 * @access  Private
 */
export const getCompanyPlacedStudents = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let company;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    company = await Company.findById(id);
  } else {
    company = await Company.findOne({ companyId: id.toUpperCase() });
  }

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  const students = await Student.find({
    placedCompany: new RegExp(company.name, 'i')
  }).select('studentId firstName lastName fullName department deptCode cgpa placedCompany placedPackage avatar');

  return sendSuccess(res, students);
});

/**
 * @desc    Create new company
 * @route   POST /api/companies
 * @access  Private (ADMIN, TPO)
 */
export const createCompany = asyncHandler(async (req, res) => {
  const {
    companyId,
    name,
    logo,
    industry,
    type,
    website,
    location,
    city,
    state,
    description,
    employeeCount,
    contactPerson,
    contactEmail,
    contactPhone,
    status,
    tier,
    averagePackage
  } = req.body;

  const finalCompanyId =
    companyId || `COMP${String((await Company.countDocuments()) + 1).padStart(3, '0')}`;

  const existing = await Company.findOne({
    $or: [{ companyId: finalCompanyId.toUpperCase() }, { name: name.trim() }]
  });
  if (existing) {
    res.status(409);
    throw new Error('Company already exists with this ID or name');
  }

  const company = await Company.create({
    companyId: finalCompanyId.toUpperCase().trim(),
    name: name.trim(),
    logo: logo || '',
    industry: industry || 'Technology & IT Services',
    type: type || 'MNC / Product',
    website: website || '',
    location: location || '',
    city: city || '',
    state: state || '',
    description: description || '',
    employeeCount: employeeCount || '',
    contactPerson: contactPerson || '',
    contactEmail: contactEmail ? contactEmail.toLowerCase().trim() : '',
    contactPhone: contactPhone || '',
    status: status || 'Active',
    tier: tier || 'Tier 1',
    averagePackage: averagePackage || '0.0 LPA',
    totalHires: 0,
    activeDrivesCount: 0
  });

  return sendSuccess(res, company, 'Company registered successfully', 201);
});

/**
 * @desc    Update company profile
 * @route   PUT /api/companies/:id
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const updateCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let company;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    company = await Company.findById(id);
  } else {
    company = await Company.findOne({ companyId: id.toUpperCase() });
  }

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined) {
      company[key] = req.body[key];
    }
  });

  const updated = await company.save();
  return sendSuccess(res, updated, 'Company updated successfully');
});

/**
 * @desc    Delete company (soft-delete)
 * @route   DELETE /api/companies/:id
 * @access  Private (ADMIN)
 */
export const deleteCompany = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let company;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    company = await Company.findById(id);
  } else {
    company = await Company.findOne({ companyId: id.toUpperCase() });
  }

  if (!company) {
    res.status(404);
    throw new Error('Company not found');
  }

  company.status = 'Inactive';
  await company.save();

  return sendSuccess(res, null, 'Company marked as inactive');
});
