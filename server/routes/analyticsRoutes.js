import express from 'express';
import {
  getOverviewMetrics,
  getDepartmentAnalytics,
  getSalaryDistribution,
  getRecruitmentFunnel,
  getSectorDistribution,
  getTopRecruiters,
  getCgpaVsPlacement,
  getSkillDemand
} from '../controllers/analyticsController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/overview', getOverviewMetrics);
router.get('/departments', getDepartmentAnalytics);
router.get('/salary-distribution', getSalaryDistribution);
router.get('/funnel', getRecruitmentFunnel);
router.get('/sectors', getSectorDistribution);
router.get('/top-recruiters', getTopRecruiters);
router.get('/cgpa-vs-placement', getCgpaVsPlacement);
router.get('/skill-demand', getSkillDemand);

export default router;
