import Application from '../models/Application.js';
import PlacementDrive from '../models/PlacementDrive.js';
import Student from '../models/Student.js';

const VALID_STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Rejected', 'Selected', 'Withdrawn'];
const VALID_STAGES = [
  'Application',
  'Aptitude Test',
  'Technical Test',
  'Technical Interview',
  'HR Interview',
  'Final Selection'
];

/**
 * Validate and update application status
 */
export const updateStatusService = async (applicationId, { status, notes, rejectionReason }) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  if (status && !VALID_STATUSES.includes(status)) {
    const error = new Error(`Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (status) application.status = status;
  if (notes !== undefined) application.notes = notes;
  if (rejectionReason !== undefined) application.rejectionReason = rejectionReason;

  // If status is Shortlisted or Selected, update shortlisted count on drive
  if (status === 'Shortlisted') {
    await PlacementDrive.findByIdAndUpdate(application.drive, {
      $inc: { shortlistedCount: 1 }
    });
  }

  // Update student status if selected
  if (status === 'Selected') {
    await Student.findByIdAndUpdate(application.student, {
      placementStatus: 'Placed',
      placedCompany: application.companyName
    });
  }

  const updated = await application.save();
  return updated;
};

/**
 * Advance or update application stage
 */
export const updateStageService = async (applicationId, { currentStage, notes }) => {
  const application = await Application.findById(applicationId);
  if (!application) {
    const error = new Error('Application not found');
    error.statusCode = 404;
    throw error;
  }

  if (currentStage && !VALID_STAGES.includes(currentStage)) {
    const error = new Error(`Invalid stage. Must be one of: ${VALID_STAGES.join(', ')}`);
    error.statusCode = 400;
    throw error;
  }

  if (currentStage) application.currentStage = currentStage;
  if (notes !== undefined) application.notes = notes;

  const updated = await application.save();
  return updated;
};

export default {
  updateStatusService,
  updateStageService
};
