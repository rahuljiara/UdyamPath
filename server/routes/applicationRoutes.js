import express from 'express';
import {
  getApplications,
  getApplicationStats,
  getApplicationById,
  updateApplicationStatus,
  updateApplicationStage,
  withdrawApplication,
  deleteApplication
} from '../controllers/applicationController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getApplications);
router.get('/stats', getApplicationStats);

router.route('/:id')
  .get(getApplicationById)
  .delete(authorizeRoles('ADMIN'), deleteApplication);

router.put('/:id/status', authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), updateApplicationStatus);
router.put('/:id/stage', authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), updateApplicationStage);
router.put('/:id/withdraw', authorizeRoles('STUDENT', 'ADMIN'), withdrawApplication);

export default router;
