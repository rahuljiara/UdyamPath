import api from './api';
import initialDrives from '../data/placementDrives.json';

const formatDrive = (d) => ({
  ...d,
  id: d._id || d.id,
  _id: d._id || d.id
});

export const driveService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/drives', { params });
      const items = (res.data || []).map(formatDrive);
      const pagination = res.pagination || {};

      return {
        drives: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 8)) || 1
      };
    } catch (err) {
      console.warn('[driveService] Fallback to local drives:', err.message);
      let result = [...initialDrives];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (d) =>
            d.title.toLowerCase().includes(q) ||
            d.companyName.toLowerCase().includes(q) ||
            d.location?.toLowerCase().includes(q)
        );
      }
      return {
        drives: result.slice(0, Number(params.limit) || 8).map(formatDrive),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 8)) || 1
      };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/drives/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[driveService] Fallback to drive stats:', err.message);
      return {
        totalDrives: initialDrives.length,
        activeDrives: initialDrives.filter((d) => d.status === 'Open' || d.status === 'In Progress').length,
        totalOpenings: initialDrives.reduce((sum, d) => sum + (Number(d.openings) || 0), 0),
        totalApplications: initialDrives.reduce((sum, d) => sum + (Number(d.applicationsCount) || 0), 0)
      };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/drives/${id}`);
      return formatDrive(res.data || res);
    } catch (err) {
      const drive = initialDrives.find((d) => d.id === id || d.driveId === id || d._id === id);
      if (!drive) throw new Error('Placement drive not found');
      return formatDrive(drive);
    }
  },

  getDriveApplications: async (driveId) => {
    try {
      const res = await api.get('/applications', { params: { drive: driveId } });
      return (res.data || []).map((a) => ({ ...a, id: a._id || a.id }));
    } catch (err) {
      return [];
    }
  },

  getDriveInterviews: async (driveId, companyName) => {
    try {
      const res = await api.get('/interviews', { params: { drive: driveId, company: companyName } });
      return (res.data || []).map((i) => ({ ...i, id: i._id || i.id }));
    } catch (err) {
      return [];
    }
  },

  applyToDrive: async (driveId, student) => {
    try {
      const res = await api.post(`/drives/${driveId}/apply`, { studentId: student?.id || student?._id });
      return res.data || res;
    } catch (err) {
      throw err;
    }
  },

  create: async (driveData) => {
    const res = await api.post('/drives', driveData);
    return formatDrive(res.data || res);
  },

  update: async (id, driveData) => {
    const res = await api.put(`/drives/${id}`, driveData);
    return formatDrive(res.data || res);
  },

  delete: async (id) => {
    const res = await api.delete(`/drives/${id}`);
    return res.data || res;
  }
};

export default driveService;
