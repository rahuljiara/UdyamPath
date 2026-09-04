import express from 'express';
import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  getDepartmentStudents,
  getDepartmentAnalytics
} from '../controllers/departmentController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getDepartments)
  .post(protect, authorizeRoles('ADMIN', 'TPO'), createDepartment);

router.route('/:id')
  .get(getDepartmentById)
  .put(protect, authorizeRoles('ADMIN', 'TPO', 'HOD'), updateDepartment)
  .delete(protect, authorizeRoles('ADMIN'), deleteDepartment);

router.get('/:id/students', protect, authorizeRoles('ADMIN', 'TPO', 'HOD'), getDepartmentStudents);
router.get('/:id/analytics', protect, authorizeRoles('ADMIN', 'TPO', 'HOD'), getDepartmentAnalytics);

export default router;
