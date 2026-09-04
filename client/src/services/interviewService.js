import api from './api';
import initialInterviews from '../data/interviews.json';

const formatInterview = (i) => ({
  ...i,
  id: i._id || i.id,
  _id: i._id || i.id
});

export const interviewService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/interviews', { params });
      const items = (res.data || []).map(formatInterview);
      const pagination = res.pagination || {};

      return {
        interviews: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 8)) || 1
      };
    } catch (err) {
      console.warn('[interviewService] Fallback to local interviews:', err.message);
      let result = [...initialInterviews];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (i) =>
            i.studentName?.toLowerCase().includes(q) ||
            i.companyName?.toLowerCase().includes(q) ||
            i.position?.toLowerCase().includes(q)
        );
      }
      return {
        interviews: result.slice(0, Number(params.limit) || 8).map(formatInterview),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 8)) || 1
      };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/interviews/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[interviewService] Fallback stats:', err.message);
      return {
        total: initialInterviews.length,
        scheduled: initialInterviews.filter((i) => i.status === 'Scheduled').length,
        completed: initialInterviews.filter((i) => i.status === 'Completed').length,
        cancelled: initialInterviews.filter((i) => i.status === 'Cancelled').length
      };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/interviews/${id}`);
      return formatInterview(res.data || res);
    } catch (err) {
      const interview = initialInterviews.find((i) => i.id === id || i.interviewId === id || i._id === id);
      if (!interview) throw new Error('Interview slot not found');
      return formatInterview(interview);
    }
  },

  schedule: async (data) => {
    const res = await api.post('/interviews', data);
    return formatInterview(res.data || res);
  },

  update: async (id, data) => {
    const res = await api.put(`/interviews/${id}`, data);
    return formatInterview(res.data || res);
  },

  delete: async (id) => {
    const res = await api.delete(`/interviews/${id}`);
    return res.data || res;
  }
};

export default interviewService;
