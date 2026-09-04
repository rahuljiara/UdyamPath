import express from 'express';
import {
  getDrives,
  getDriveStats,
  getDriveById,
  createDrive,
  updateDrive,
  deleteDrive,
  applyToDrive,
  getDriveApplications,
  getDriveShortlisted,
  getDriveSelected
} from '../controllers/driveController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { validateDriveInput } from '../validators/driveValidator.js';

const router = express.Router();

router.route('/')
  .get(getDrives)
  .post(protect, authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), validateDriveInput, createDrive);

router.get('/stats', getDriveStats);

router.route('/:id')
  .get(getDriveById)
  .put(protect, authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), validateDriveInput, updateDrive)
  .delete(protect, authorizeRoles('ADMIN', 'TPO'), deleteDrive);

router.post('/:id/apply', protect, authorizeRoles('STUDENT', 'ADMIN', 'TPO'), applyToDrive);
router.get('/:id/applications', protect, authorizeRoles('ADMIN', 'TPO', 'RECRUITER', 'HOD'), getDriveApplications);
router.get('/:id/shortlisted', protect, authorizeRoles('ADMIN', 'TPO', 'RECRUITER', 'HOD'), getDriveShortlisted);
router.get('/:id/selected', protect, authorizeRoles('ADMIN', 'TPO', 'RECRUITER', 'HOD'), getDriveSelected);

export default router;
