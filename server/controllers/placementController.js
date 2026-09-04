import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Placement from '../models/Placement.js';
import { recordPlacement } from '../services/placementService.js';

/**
 * @desc    Get all confirmed placements with filters & pagination
 * @route   GET /api/placements
 * @access  Private
 */
export const getPlacements = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  if (req.query.department && req.query.department !== 'All') {
    query.department = new RegExp(req.query.department, 'i');
  }
  if (req.query.company && req.query.company !== 'All') {
    query.companyName = req.query.company;
  }
  if (req.query.placementYear && req.query.placementYear !== 'All') {
    query.placementYear = req.query.placementYear;
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { studentName: sRegex },
      { companyName: sRegex },
      { jobTitle: sRegex }
    ];
  }

  const [placements, total] = await Promise.all([
    Placement.find(query)
      .populate('student', 'studentId fullName email department deptCode cgpa avatar')
      .populate('company', 'name logo website')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Placement.countDocuments(query)
  ]);

  const formattedPlacements = placements.map((p) => ({
    ...p,
    id: p._id.toString()
  }));

  return sendPaginated(res, formattedPlacements, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get placement record by ID
 * @route   GET /api/placements/:id
 * @access  Private
 */
export const getPlacementById = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id)
    .populate('student', 'studentId fullName email department deptCode cgpa avatar')
    .populate('company', 'name logo website');

  if (!placement) {
    res.status(404);
    throw new Error('Placement record not found');
  }

  return sendSuccess(res, placement);
});

/**
 * @desc    Create / record confirmed placement
 * @route   POST /api/placements
 * @access  Private (ADMIN, TPO)
 */
export const createPlacement = asyncHandler(async (req, res) => {
  const placement = await recordPlacement(req.body);
  return sendSuccess(res, placement, 'Placement recorded successfully', 201);
});

/**
 * @desc    Update placement record
 * @route   PUT /api/placements/:id
 * @access  Private (ADMIN, TPO)
 */
export const updatePlacement = asyncHandler(async (req, res) => {
  const placement = await Placement.findById(req.params.id);
  if (!placement) {
    res.status(404);
    throw new Error('Placement record not found');
  }

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined) {
      placement[key] = req.body[key];
    }
  });

  const updated = await placement.save();
  return sendSuccess(res, updated, 'Placement updated successfully');
});
