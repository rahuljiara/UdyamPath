import Placement from '../models/Placement.js';
import Student from '../models/Student.js';
import Offer from '../models/Offer.js';
import Application from '../models/Application.js';

/**
 * Record a verified placement and synchronize student & offer status
 */
export const recordPlacement = async ({
  studentId,
  companyId,
  companyName,
  jobTitle,
  ctc,
  joiningDate,
  placementYear,
  department,
  offerId,
  applicationId
}) => {
  const student = await Student.findById(studentId);
  if (!student) {
    const error = new Error('Student not found');
    error.statusCode = 404;
    throw error;
  }

  // Create or find placement
  let placement = await Placement.findOne({
    student: studentId,
    companyName
  });

  if (!placement) {
    placement = await Placement.create({
      student: studentId,
      studentName: student.fullName,
      company: companyId || undefined,
      companyName,
      jobTitle,
      ctc,
      joiningDate: joiningDate || '',
      placementYear: placementYear || '2024-2025',
      department: department || student.deptCode || student.department,
      offer: offerId || undefined,
      status: 'Confirmed'
    });
  }

  // Synchronize student status
  student.placementStatus = 'Placed';
  student.placedCompany = companyName;
  student.placedPackage = ctc;
  await student.save();

  // If offer exists, mark Accepted
  if (offerId) {
    await Offer.findByIdAndUpdate(offerId, { status: 'Accepted' });
  }

  // If application exists, mark Selected
  if (applicationId) {
    await Application.findByIdAndUpdate(applicationId, {
      status: 'Selected',
      currentStage: 'Final Selection'
    });
  }

  return placement;
};

export default {
  recordPlacement
};
