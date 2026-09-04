import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess, sendPaginated } from '../utils/apiResponse.js';
import Offer from '../models/Offer.js';
import Student from '../models/Student.js';
import Placement from '../models/Placement.js';

/**
 * @desc    Get all placement offers with filters & pagination
 * @route   GET /api/offers
 * @access  Private
 */
export const getOffers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const query = {};

  // If Student, only view their own offers
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

  // If HOD, scope to department
  if (req.user.role === 'HOD' && req.user.department) {
    query.studentDepartment = new RegExp(req.user.department, 'i');
  }

  if (req.query.status && req.query.status !== 'All') {
    query.status = req.query.status;
  }
  if (req.query.department && req.query.department !== 'All') {
    query.studentDepartment = req.query.department;
  }
  if (req.query.company && req.query.company !== 'All') {
    query.companyName = req.query.company;
  }
  if (req.query.search) {
    const sRegex = new RegExp(req.query.search, 'i');
    query.$or = [
      { studentName: sRegex },
      { companyName: sRegex },
      { jobTitle: sRegex },
      { offerId: sRegex }
    ];
  }

  const [offers, total] = await Promise.all([
    Offer.find(query)
      .populate('student', 'studentId fullName email department deptCode cgpa avatar')
      .populate('company', 'name logo website')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Offer.countDocuments(query)
  ]);

  const formattedOffers = offers.map((o) => ({
    ...o,
    id: o._id.toString()
  }));

  return sendPaginated(res, formattedOffers, {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1
  });
});

/**
 * @desc    Get aggregated offer stats
 * @route   GET /api/offers/stats
 * @access  Private
 */
export const getOfferStats = asyncHandler(async (req, res) => {
  const query = {};
  if (req.user.role === 'STUDENT') {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
    if (student) query.student = student._id;
  }

  const offers = await Offer.find(query).select('status ctc');
  const totalOffers = offers.length;
  const acceptedOffers = offers.filter((o) => o.status === 'Accepted').length;
  const acceptanceRate = totalOffers > 0 ? `${((acceptedOffers / totalOffers) * 100).toFixed(1)}%` : '0%';

  const packages = offers
    .map((o) => parseFloat(o.ctc))
    .filter((n) => !isNaN(n));

  const highestNum = packages.length > 0 ? Math.max(...packages) : 0;
  const avgNum = packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : '0.0';

  return sendSuccess(res, {
    totalOffers,
    acceptedOffers,
    acceptanceRate,
    highestPackage: `${highestNum.toFixed(1)} LPA`,
    averagePackage: `${avgNum} LPA`
  });
});

/**
 * @desc    Get offer by ID
 * @route   GET /api/offers/:id
 * @access  Private
 */
export const getOfferById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let offer;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    offer = await Offer.findById(id)
      .populate('student', 'studentId fullName email department deptCode cgpa avatar')
      .populate('company', 'name logo website');
  } else {
    offer = await Offer.findOne({ offerId: id.toUpperCase() })
      .populate('student', 'studentId fullName email department deptCode cgpa avatar')
      .populate('company', 'name logo website');
  }

  if (!offer) {
    res.status(404);
    throw new Error('Offer record not found');
  }

  return sendSuccess(res, offer);
});

/**
 * @desc    Create new placement offer
 * @route   POST /api/offers
 * @access  Private (ADMIN, TPO, RECRUITER)
 */
export const createOffer = asyncHandler(async (req, res) => {
  const {
    student,
    studentName,
    studentDepartment,
    studentAvatar,
    company,
    companyName,
    companyLogo,
    drive,
    application,
    jobTitle,
    ctc,
    salaryBreakup,
    offerDate,
    joiningDate,
    offerLetterUrl,
    status,
    notes
  } = req.body;

  if (!studentName || !companyName || !jobTitle || !ctc) {
    res.status(400);
    throw new Error('Student name, company name, job title, and CTC package are required');
  }

  const offerCount = await Offer.countDocuments();
  const offerId = `OFF${new Date().getFullYear()}-${String(offerCount + 1).padStart(3, '0')}`;

  const offer = await Offer.create({
    offerId,
    student: student || undefined,
    studentName: studentName.trim(),
    studentDepartment: studentDepartment || '',
    studentAvatar: studentAvatar || '',
    company: company || undefined,
    companyName: companyName.trim(),
    companyLogo: companyLogo || '',
    drive: drive || undefined,
    application: application || undefined,
    jobTitle: jobTitle.trim(),
    ctc: ctc.trim(),
    salaryBreakup: salaryBreakup || '',
    offerDate: offerDate || new Date().toISOString().slice(0, 10),
    joiningDate: joiningDate || '',
    offerLetterUrl: offerLetterUrl || '',
    status: status || 'Offered',
    notes: notes || ''
  });

  return sendSuccess(res, offer, 'Placement offer created successfully', 201);
});

/**
 * @desc    Update offer status (Accept / Decline / Offered)
 * @route   PUT /api/offers/:id
 * @access  Private
 */
export const updateOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let offer;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    offer = await Offer.findById(id);
  } else {
    offer = await Offer.findOne({ offerId: id.toUpperCase() });
  }

  if (!offer) {
    res.status(404);
    throw new Error('Offer not found');
  }

  // If Student, verify it's their offer
  if (req.user.role === 'STUDENT') {
    const student = await Student.findOne({
      $or: [{ user: req.user._id }, { email: req.user.email.toLowerCase() }]
    });
    if (!student || (offer.student && offer.student.toString() !== student._id.toString())) {
      res.status(403);
      throw new Error('Forbidden: You can only update your own placement offers');
    }
  }

  Object.keys(req.body).forEach((key) => {
    if (req.body[key] !== undefined) {
      offer[key] = req.body[key];
    }
  });

  // If offer status is Accepted, update student placementStatus and create Placement record
  if (req.body.status === 'Accepted' && offer.student) {
    await Student.findByIdAndUpdate(offer.student, {
      placementStatus: 'Placed',
      placedCompany: offer.companyName,
      placedPackage: offer.ctc
    });

    // Check if placement record already exists
    const existingPlacement = await Placement.findOne({
      student: offer.student,
      companyName: offer.companyName
    });

    if (!existingPlacement) {
      await Placement.create({
        student: offer.student,
        studentName: offer.studentName,
        company: offer.company || undefined,
        companyName: offer.companyName,
        jobTitle: offer.jobTitle,
        ctc: offer.ctc,
        joiningDate: offer.joiningDate || '',
        department: offer.studentDepartment,
        offer: offer._id,
        status: 'Confirmed'
      });
    }
  }

  const updated = await offer.save();
  return sendSuccess(res, updated, 'Offer updated successfully');
});

/**
 * @desc    Delete offer
 * @route   DELETE /api/offers/:id
 * @access  Private (ADMIN, TPO)
 */
export const deleteOffer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let offer;

  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    offer = await Offer.findById(id);
  } else {
    offer = await Offer.findOne({ offerId: id.toUpperCase() });
  }

  if (!offer) {
    res.status(404);
    throw new Error('Offer record not found');
  }

  await offer.deleteOne();
  return sendSuccess(res, null, 'Offer deleted successfully');
});
