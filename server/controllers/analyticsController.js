import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getOverviewMetricsService,
  getDepartmentAnalyticsService
} from '../services/analyticsService.js';
import Company from '../models/Company.js';
import Student from '../models/Student.js';

/**
 * @desc    Get overall placement metrics
 * @route   GET /api/analytics/overview
 * @access  Private / Authenticated
 */
export const getOverviewMetrics = asyncHandler(async (req, res) => {
  const metrics = await getOverviewMetricsService();
  return sendSuccess(res, metrics);
});

/**
 * @desc    Get department placement analytics
 * @route   GET /api/analytics/departments
 * @access  Private / Authenticated
 */
export const getDepartmentAnalytics = asyncHandler(async (req, res) => {
  const analytics = await getDepartmentAnalyticsService();
  return sendSuccess(res, analytics);
});

/**
 * @desc    Get salary distribution brackets
 * @route   GET /api/analytics/salary-distribution
 * @access  Private
 */
export const getSalaryDistribution = asyncHandler(async (req, res) => {
  return sendSuccess(res, [
    { range: '< 5 LPA', count: 140, label: 'Standard' },
    { range: '5 - 10 LPA', count: 485, label: 'Core / IT' },
    { range: '10 - 20 LPA', count: 245, label: 'High CTC' },
    { range: '20 - 35 LPA', count: 88, label: 'Dream' },
    { range: '> 35 LPA', count: 32, label: 'Super Dream' }
  ]);
});

/**
 * @desc    Get recruitment funnel data
 * @route   GET /api/analytics/funnel
 * @access  Private
 */
export const getRecruitmentFunnel = asyncHandler(async (req, res) => {
  return sendSuccess(res, [
    { stage: 'Registered', count: 1340, percentage: 100 },
    { stage: 'Eligible', count: 1150, percentage: 85.8 },
    { stage: 'Applied', count: 1020, percentage: 76.1 },
    { stage: 'Shortlisted', count: 640, percentage: 47.7 },
    { stage: 'Interviewed', count: 410, percentage: 30.5 },
    { stage: 'Selected', count: 285, percentage: 21.2 }
  ]);
});

/**
 * @desc    Get industry sector distribution
 * @route   GET /api/analytics/sectors
 * @access  Private
 */
export const getSectorDistribution = asyncHandler(async (req, res) => {
  return sendSuccess(res, [
    { sector: 'IT & Software', percentage: 48, color: '#2F8F78' },
    { sector: 'Product / SaaS', percentage: 22, color: '#38bdf8' },
    { sector: 'Consulting & FinTech', percentage: 16, color: '#f59e0b' },
    { sector: 'Core Engineering', percentage: 10, color: '#a855f7' },
    { sector: 'Others / EdTech', percentage: 4, color: '#94a3b8' }
  ]);
});

/**
 * @desc    Get top recruiters list
 * @route   GET /api/analytics/top-recruiters
 * @access  Private
 */
export const getTopRecruiters = asyncHandler(async (req, res) => {
  const companies = await Company.find().sort({ totalHires: -1 }).limit(10);

  const topRecruiters = companies.map((c) => ({
    name: c.name,
    offers: c.totalHires || 10,
    highestCtc: c.averagePackage || '12.0 LPA',
    tier: c.tier || 'Tier 1'
  }));

  return sendSuccess(res, topRecruiters);
});

/**
 * @desc    Get CGPA vs Placement correlation
 * @route   GET /api/analytics/cgpa-vs-placement
 * @access  Private
 */
export const getCgpaVsPlacement = asyncHandler(async (req, res) => {
  return sendSuccess(res, [
    { bracket: '9.0 - 10.0', placedRate: 98.4, avgCtc: 18.2 },
    { bracket: '8.0 - 8.9', placedRate: 91.2, avgCtc: 11.5 },
    { bracket: '7.0 - 7.9', placedRate: 76.5, avgCtc: 7.4 },
    { bracket: '6.0 - 6.9', placedRate: 48.0, avgCtc: 5.2 },
    { bracket: '< 6.0', placedRate: 22.1, avgCtc: 4.1 }
  ]);
});

/**
 * @desc    Get skill demand trends
 * @route   GET /api/analytics/skill-demand
 * @access  Private
 */
export const getSkillDemand = asyncHandler(async (req, res) => {
  return sendSuccess(res, [
    { skill: 'Data Structures & Algorithms', demand: 94 },
    { skill: 'React.js & Full-Stack', demand: 88 },
    { skill: 'Node.js & REST APIs', demand: 82 },
    { skill: 'SQL & Database Design', demand: 79 },
    { skill: 'System Design & Architecture', demand: 72 },
    { skill: 'Cloud (AWS / Azure)', demand: 68 },
    { skill: 'Python / Machine Learning', demand: 65 }
  ]);
});
