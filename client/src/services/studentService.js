import initialStudents from '../data/students.json';
import initialApplications from '../data/applications.json';

let studentsList = [...initialStudents];
let applicationsList = [...initialApplications];

export const studentService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...studentsList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (s) =>
          s.fullName.toLowerCase().includes(q) ||
          s.studentId.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          (s.skills && s.skills.some((sk) => sk.toLowerCase().includes(q)))
      );
    }
    if (params.department && params.department !== 'All') {
      result = result.filter(
        (s) => s.deptCode === params.department || s.department === params.department
      );
    }
    if (params.batch && params.batch !== 'All') {
      result = result.filter((s) => s.batch === params.batch);
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((s) => s.placementStatus === params.status);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      students: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const total = studentsList.length;
    const placed = studentsList.filter((s) => s.placementStatus === 'Placed').length;
    const eligible = studentsList.filter((s) => s.isEligible).length;
    const totalCgpa = studentsList.reduce((acc, s) => acc + (Number(s.cgpa) || 0), 0);
    const avgCgpa = total > 0 ? (totalCgpa / total).toFixed(2) : '0.00';
    const placementRate = total > 0 ? `${((placed / total) * 100).toFixed(1)}%` : '0%';

    return {
      total,
      placed,
      eligible,
      avgCgpa,
      placementRate
    };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const student = studentsList.find((s) => s.id === id || s.studentId === id);
    if (!student) throw new Error('Student not found');
    return student;
  },

  getStudentApplications: async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return applicationsList.filter((a) => a.studentId === studentId);
  },

  create: async (studentData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newStudent = {
      ...studentData,
      id: `stud-${Date.now()}`,
      fullName: `${studentData.firstName || ''} ${studentData.lastName || ''}`.trim(),
      skills: Array.isArray(studentData.skills)
        ? studentData.skills
        : (studentData.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      programmingLanguages: Array.isArray(studentData.programmingLanguages)
        ? studentData.programmingLanguages
        : (studentData.programmingLanguages || '').split(',').map((s) => s.trim()).filter(Boolean),
      createdAt: new Date().toISOString()
    };
    studentsList.unshift(newStudent);
    return newStudent;
  },

  update: async (id, studentData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = studentsList.findIndex((s) => s.id === id || s.studentId === id);
    if (index === -1) throw new Error('Student not found');

    const updated = {
      ...studentsList[index],
      ...studentData,
      fullName: `${studentData.firstName || studentsList[index].firstName} ${studentData.lastName || studentsList[index].lastName}`.trim(),
      skills: Array.isArray(studentData.skills)
        ? studentData.skills
        : (studentData.skills || '').split(',').map((s) => s.trim()).filter(Boolean),
      programmingLanguages: Array.isArray(studentData.programmingLanguages)
        ? studentData.programmingLanguages
        : (studentData.programmingLanguages || '').split(',').map((s) => s.trim()).filter(Boolean),
      updatedAt: new Date().toISOString()
    };

    studentsList[index] = updated;
    return updated;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    studentsList = studentsList.filter((s) => s.id !== id && s.studentId !== id);
    return { success: true };
  }
};
