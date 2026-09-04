import api from './api';
import initialStudents from '../data/students.json';

const formatStudent = (s) => ({
  ...s,
  id: s._id || s.id,
  _id: s._id || s.id
});

export const studentService = {
  getAll: async (params = {}) => {
    try {
      const res = await api.get('/students', { params });
      const items = (res.data || []).map(formatStudent);
      const pagination = res.pagination || {};

      return {
        students: items,
        total: pagination.total !== undefined ? pagination.total : items.length,
        page: pagination.page || Number(params.page) || 1,
        totalPages: pagination.totalPages || Math.ceil((pagination.total || items.length) / (params.limit || 10)) || 1
      };
    } catch (err) {
      console.warn('[studentService] Fallback to local data:', err.message);
      let result = [...initialStudents];
      if (params.search) {
        const q = params.search.toLowerCase();
        result = result.filter(
          (s) =>
            s.fullName.toLowerCase().includes(q) ||
            s.studentId.toLowerCase().includes(q) ||
            s.email.toLowerCase().includes(q)
        );
      }
      if (params.department && params.department !== 'All') {
        result = result.filter(
          (s) => s.deptCode === params.department || s.department === params.department
        );
      }
      return {
        students: result.slice(0, Number(params.limit) || 10).map(formatStudent),
        total: result.length,
        page: Number(params.page) || 1,
        totalPages: Math.ceil(result.length / (Number(params.limit) || 10)) || 1
      };
    }
  },

  getStats: async () => {
    try {
      const res = await api.get('/students/stats');
      return res.data || res;
    } catch (err) {
      console.warn('[studentService] Fallback to computed stats:', err.message);
      const total = initialStudents.length;
      const placed = initialStudents.filter((s) => s.placementStatus === 'Placed').length;
      const eligible = initialStudents.filter((s) => s.isEligible).length;
      const totalCgpa = initialStudents.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0);
      return {
        total,
        placed,
        eligible,
        avgCgpa: total > 0 ? (totalCgpa / total).toFixed(2) : '0.00',
        placementRate: total > 0 ? `${((placed / total) * 100).toFixed(1)}%` : '0%'
      };
    }
  },

  getById: async (id) => {
    try {
      const res = await api.get(`/students/${id}`);
      return formatStudent(res.data || res);
    } catch (err) {
      console.warn('[studentService] Fallback getById:', err.message);
      const student = initialStudents.find((s) => s.id === id || s.studentId === id || s._id === id);
      if (!student) throw new Error('Student not found');
      return formatStudent(student);
    }
  },

  getStudentApplications: async (studentId) => {
    try {
      const res = await api.get('/applications', { params: { student: studentId } });
      return (res.data || []).map((a) => ({ ...a, id: a._id || a.id }));
    } catch (err) {
      return [];
    }
  },

  create: async (studentData) => {
    const res = await api.post('/students', studentData);
    return formatStudent(res.data || res);
  },

  update: async (id, studentData) => {
    const res = await api.put(`/students/${id}`, studentData);
    return formatStudent(res.data || res);
  },

  delete: async (id) => {
    const res = await api.delete(`/students/${id}`);
    return res.data || res;
  }
};

export default studentService;
