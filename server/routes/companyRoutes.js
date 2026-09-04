import express from 'express';
import {
  getCompanies,
  getCompanyStats,
  getCompanyById,
  getCompanyDrives,
  getCompanyPlacedStudents,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';
import { validateCompanyInput } from '../validators/companyValidator.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getCompanies)
  .post(authorizeRoles('ADMIN', 'TPO'), validateCompanyInput, createCompany);

router.get('/stats', getCompanyStats);

router.route('/:id')
  .get(getCompanyById)
  .put(authorizeRoles('ADMIN', 'TPO', 'RECRUITER'), validateCompanyInput, updateCompany)
  .delete(authorizeRoles('ADMIN'), deleteCompany);

router.get('/:id/drives', getCompanyDrives);
router.get('/:id/placements', getCompanyPlacedStudents);

export default router;
