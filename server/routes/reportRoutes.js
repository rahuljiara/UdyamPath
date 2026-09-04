import express from 'express';
import { getReportData } from '../controllers/reportController.js';
import protect from '../middleware/authMiddleware.js';
import authorizeRoles from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('ADMIN', 'TPO', 'HOD'));

router.get('/data', getReportData);
router.get('/placements', (req, res, next) => {
  req.query.reportType = 'summary';
  return getReportData(req, res, next);
});
router.get('/departments', (req, res, next) => {
  req.query.reportType = 'department';
  return getReportData(req, res, next);
});
router.get('/companies', (req, res, next) => {
  req.query.reportType = 'company';
  return getReportData(req, res, next);
});
router.get('/unplaced', (req, res, next) => {
  req.query.reportType = 'unplaced';
  return getReportData(req, res, next);
});

export default router;
