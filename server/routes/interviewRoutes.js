import express from 'express';
import {
  getInterviews,
  getInterviewStats,
  getInterviewById,
  scheduleInterview,
  updateInterview,
  deleteInterview
} from '../controllers/interviewController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getInterviews)
  .post(authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), scheduleInterview);

router.get('/stats', getInterviewStats);

router.route('/:id')
  .get(getInterviewById)
  .put(authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), updateInterview)
  .delete(authorizeRoles('ADMIN', 'TPO'), deleteInterview);

export default router;
