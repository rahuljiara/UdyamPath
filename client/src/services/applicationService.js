import api from './api';
import initialApplications from '../data/applications.json';

const formatApp = (a) => ({
  ...a,
  id: a._id || a.id,
  _id: a._id || a.id
});

export const applicationService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/applications', { params });
      const items = (res.data || []).map(formatApp);
      const pagination = res.pagination || {};

      return {
        applications: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 8)) || 1
      };
    } catch (err) {
      console.warn('[applicationService] Fallback to local applications:', err.message);
      let result = [...initialApplications];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (a) =>
            a.studentName?.toLowerCase().includes(q) ||
            a.companyName?.toLowerCase().includes(q) ||
            a.position?.toLowerCase().includes(q) ||
            a.applicationId?.toLowerCase().includes(q)
        );
      }
      return {
        applications: result.slice(0, Number(params.limit) || 8).map(formatApp),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 8)) || 1
      };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/applications/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[applicationService] Fallback to stats:', err.message);
      return {
        total: initialApplications.length,
        underReview: initialApplications.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length,
        shortlisted: initialApplications.filter((a) => a.status === 'Shortlisted').length,
        selected: initialApplications.filter((a) => a.status === 'Selected').length,
        rejected: initialApplications.filter((a) => a.status === 'Rejected').length
      };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/applications/${id}`);
      return formatApp(res.data || res);
    } catch (err) {
      const app = initialApplications.find((a) => a.id === id || a.applicationId === id || a._id === id);
      if (!app) throw new Error('Application not found');
      return formatApp(app);
    }
  },

  updateStatus: async (id, updateData) => {
    const res = await api.put(`/applications/${id}/status`, updateData);
    return formatApp(res.data || res);
  },

  updateStage: async (id, stageData) => {
    const res = await api.put(`/applications/${id}/stage`, stageData);
    return formatApp(res.data || res);
  },

  withdraw: async (id) => {
    const res = await api.put(`/applications/${id}/withdraw`);
    return res.data || res;
  },

  delete: async (id) => {
    const res = await api.delete(`/applications/${id}`);
    return res.data || res;
  }
};

export default applicationService;
