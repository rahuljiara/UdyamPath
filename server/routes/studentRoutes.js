import express from 'express';
import {
  getStudents,
  getStudentStats,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentApplications,
  getStudentPlacements
} from '../controllers/studentController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { validateStudentInput } from '../validators/studentValidator.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorizeRoles('ADMIN', 'TPO', 'HOD'), getStudents)
  .post(authorizeRoles('ADMIN', 'TPO', 'HOD'), validateStudentInput, createStudent);

router.get('/stats', authorizeRoles('ADMIN', 'TPO', 'HOD'), getStudentStats);

router.route('/:id')
  .get(authorizeRoles('ADMIN', 'TPO', 'HOD', 'STUDENT'), getStudentById)
  .put(authorizeRoles('ADMIN', 'TPO', 'HOD', 'STUDENT'), validateStudentInput, updateStudent)
  .delete(authorizeRoles('ADMIN', 'TPO'), deleteStudent);

router.get('/:id/applications', authorizeRoles('ADMIN', 'TPO', 'HOD', 'STUDENT'), getStudentApplications);
router.get('/:id/placements', authorizeRoles('ADMIN', 'TPO', 'HOD', 'STUDENT'), getStudentPlacements);

export default router;
