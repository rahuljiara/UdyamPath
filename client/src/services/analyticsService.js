import api from './api';
import initialDashboardStats from '../data/dashboardStats.json';

export const analyticsService = {
  getOverviewMetrics: async () => {
    try {
      const res = await api.get('/analytics/overview');
      return res.data || res;
    } catch (err) {
      console.warn('[analyticsService] Fallback to overview stats:', err.message);
      return {
        totalStudents: 100,
        eligibleStudents: 95,
        placedStudents: 50,
        placementRate: '50.0%',
        totalOffers: 50,
        highestPackage: '52.0 LPA',
        averagePackage: '18.4 LPA',
        medianPackage: '16.5 LPA',
        totalCompanies: 17,
        activeDrives: 7
      };
    }
  },

  getDepartmentAnalytics: async () => {
    try {
      const res = await api.get('/analytics/departments');
      return res.data || res;
    } catch (err) {
      console.warn('[analyticsService] Fallback department stats:', err.message);
      return [
        { dept: 'CSE', total: 30, placed: 20, unplaced: 10, rate: 66.7, avgCtc: 24.2, highestCtc: 52.0 },
        { dept: 'IT', total: 25, placed: 15, unplaced: 10, rate: 60.0, avgCtc: 18.5, highestCtc: 46.0 },
        { dept: 'ECE', total: 20, placed: 10, unplaced: 10, rate: 50.0, avgCtc: 16.2, highestCtc: 28.0 },
        { dept: 'EEE', total: 15, placed: 3, unplaced: 12, rate: 20.0, avgCtc: 13.5, highestCtc: 19.5 },
        { dept: 'MECH', total: 10, placed: 2, unplaced: 8, rate: 20.0, avgCtc: 8.5, highestCtc: 9.0 }
      ];
    }
  },

  getSalaryDistribution: async () => {
    try {
      const res = await api.get('/analytics/salary-distribution');
      return res.data || res;
    } catch (err) {
      return [
        { range: '< 5 LPA', count: 5, label: 'Standard' },
        { range: '5 - 10 LPA', count: 18, label: 'Core / IT' },
        { range: '10 - 20 LPA', count: 15, label: 'High CTC' },
        { range: '20 - 35 LPA', count: 8, label: 'Dream' },
        { range: '> 35 LPA', count: 4, label: 'Super Dream' }
      ];
    }
  },

  getRecruitmentFunnel: async () => {
    try {
      const res = await api.get('/analytics/funnel');
      return res.data || res;
    } catch (err) {
      return initialDashboardStats.placementFunnel || [];
    }
  },

  getSectorDistribution: async () => {
    try {
      const res = await api.get('/analytics/sectors');
      return res.data || res;
    } catch (err) {
      return [
        { sector: 'IT & Software', percentage: 48, color: '#2F8F78' },
        { sector: 'Product / SaaS', percentage: 22, color: '#38bdf8' },
        { sector: 'Consulting & FinTech', percentage: 16, color: '#f59e0b' },
        { sector: 'Core Engineering', percentage: 10, color: '#a855f7' },
        { sector: 'Others / EdTech', percentage: 4, color: '#94a3b8' }
      ];
    }
  },

  getTopRecruiters: async () => {
    try {
      const res = await api.get('/analytics/top-recruiters');
      return res.data || res;
    } catch (err) {
      return [
        { name: 'Tata Consultancy Services', offers: 142, highestCtc: '9.0 LPA', tier: 'Mass Recruiter' },
        { name: 'Deloitte USI', offers: 36, highestCtc: '11.5 LPA', tier: 'Tier 2' },
        { name: 'Google India', offers: 25, highestCtc: '52.0 LPA', tier: 'Tier 1 (Dream)' },
        { name: 'Microsoft India', offers: 32, highestCtc: '44.0 LPA', tier: 'Tier 1 (Dream)' },
        { name: 'Qualcomm India', offers: 18, highestCtc: '28.0 LPA', tier: 'Tier 1 (Dream)' }
      ];
    }
  },

  getCgpaVsPlacement: async () => {
    try {
      const res = await api.get('/analytics/cgpa-vs-placement');
      return res.data || res;
    } catch (err) {
      return [
        { bracket: '9.0 - 10.0', placedRate: 98.4, avgCtc: 18.2 },
        { bracket: '8.0 - 8.9', placedRate: 91.2, avgCtc: 11.5 },
        { bracket: '7.0 - 7.9', placedRate: 76.5, avgCtc: 7.4 },
        { bracket: '6.0 - 6.9', placedRate: 48.0, avgCtc: 5.2 },
        { bracket: '< 6.0', placedRate: 22.1, avgCtc: 4.1 }
      ];
    }
  },

  getSkillDemand: async () => {
    try {
      const res = await api.get('/analytics/skill-demand');
      return res.data || res;
    } catch (err) {
      return [
        { skill: 'Data Structures & Algorithms', demand: 94 },
        { skill: 'React.js & Full-Stack', demand: 88 },
        { skill: 'Node.js & REST APIs', demand: 82 },
        { skill: 'SQL & Database Design', demand: 79 },
        { skill: 'System Design & Architecture', demand: 72 },
        { skill: 'Cloud (AWS / Azure)', demand: 68 },
        { skill: 'Python / Machine Learning', demand: 65 }
      ];
    }
  }
};

export default analyticsService;
