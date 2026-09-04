import api from './api';
import dashboardStats from '../data/dashboardStats.json';
import placementDrives from '../data/placementDrives.json';
import applications from '../data/applications.json';
import interviews from '../data/interviews.json';

export const dashboardService = {
  getOverview: async () => {
    try {
      const res = await api.get('/analytics/overview');
      return res.data || res;
    } catch (err) {
      console.warn('[dashboardService] Fallback to overview:', err.message);
      return dashboardStats.overview;
    }
  },

  getPlacementFunnel: async () => {
    try {
      const res = await api.get('/analytics/funnel');
      return res.data || res;
    } catch (err) {
      return dashboardStats.placementFunnel;
    }
  },

  getMonthlyTrend: async () => {
    return dashboardStats.monthlyTrend;
  },

  getDepartmentDistribution: async () => {
    try {
      const res = await api.get('/analytics/departments');
      return (res.data || res).map((d) => ({
        department: d.dept || d.name,
        placed: d.placed,
        total: d.total,
        rate: `${d.rate}%`,
        avgCtc: `${d.avgCtc} LPA`
      }));
    } catch (err) {
      return dashboardStats.departmentDistribution;
    }
  },

  getActiveDrives: async (limit = 4) => {
    try {
      const res = await api.get('/drives', { params: { limit } });
      const items = (res.data || []).map((d) => ({ ...d, id: d._id || d.id }));
      return items.filter((d) => d.status === 'Open' || d.status === 'In Progress').slice(0, limit);
    } catch (err) {
      return placementDrives.filter((d) => d.status === 'Open' || d.status === 'In Progress').slice(0, limit);
    }
  },

  getRecentApplications: async (limit = 5) => {
    try {
      const res = await api.get('/applications', { params: { limit } });
      return (res.data || []).map((a) => ({ ...a, id: a._id || a.id })).slice(0, limit);
    } catch (err) {
      return applications.slice(0, limit);
    }
  },

  getUpcomingInterviews: async (limit = 4) => {
    try {
      const res = await api.get('/interviews', { params: { status: 'Scheduled', limit } });
      return (res.data || []).map((i) => ({ ...i, id: i._id || i.id })).slice(0, limit);
    } catch (err) {
      return interviews.filter((i) => i.status === 'Scheduled').slice(0, limit);
    }
  }
};

export default dashboardService;
