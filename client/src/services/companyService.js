import api from './api';
import initialCompanies from '../data/companies.json';

const formatCompany = (c) => ({
  ...c,
  id: c._id || c.id,
  _id: c._id || c.id
});

export const companyService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/companies', { params });
      const items = (res.data || []).map(formatCompany);
      const pagination = res.pagination || {};

      return {
        companies: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 9)) || 1
      };
    } catch (err) {
      console.warn('[companyService] Fallback to local data:', err.message);
      let result = [...initialCompanies];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.industry?.toLowerCase().includes(q) ||
            c.city?.toLowerCase().includes(q)
        );
      }
      return {
        companies: result.slice(0, Number(params.limit) || 9).map(formatCompany),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 9)) || 1
      };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/companies/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[companyService] Fallback to stats:', err.message);
      return {
        totalCompanies: initialCompanies.length,
        activeCompanies: initialCompanies.filter((c) => c.status === 'Active').length,
        totalHires: initialCompanies.reduce((sum, c) => sum + (c.totalHires || 0), 0),
        activeDrivesCount: 6
      };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/companies/${id}`);
      return formatCompany(res.data || res);
    } catch (err) {
      const company = initialCompanies.find((c) => c.id === id || c.companyId === id || c._id === id);
      if (!company) throw new Error('Company not found');
      return formatCompany(company);
    }
  },

  getCompanyDrives: async (companyId, companyName) => {
    try {
      const res = await api.get('/drives', { params: { company: companyId || companyName } });
      return (res.data || []).map((d) => ({ ...d, id: d._id || d.id }));
    } catch (err) {
      return [];
    }
  },

  getCompanyPlacedStudents: async (companyName) => {
    try {
      const res = await api.get('/students', { params: { search: companyName } });
      return (res.data || []).filter((s) => s.placedCompany && s.placedCompany.toLowerCase().includes((companyName || '').toLowerCase()));
    } catch (err) {
      return [];
    }
  },

  create: async (companyData) => {
    const res = await api.post('/companies', companyData);
    return formatCompany(res.data || res);
  },

  update: async (id, companyData) => {
    const res = await api.put(`/companies/${id}`, companyData);
    return formatCompany(res.data || res);
  },

  delete: async (id) => {
    const res = await api.delete(`/companies/${id}`);
    return res.data || res;
  }
};

export default companyService;
