import initialDepartments from '../data/departments.json';

let departmentsList = [...initialDepartments];

let settingsData = {
  institution: {
    name: 'National Institute of Technology & Engineering',
    code: 'NITE-2025',
    tagline: 'Empowering Engineering Excellence',
    naacGrade: 'A++',
    nirfRank: '28',
    nbaAccredited: true,
    tpoName: 'Prof. Ramesh K. Verma',
    tpoEmail: 'tpo@college.edu.in',
    tpoPhone: '+91 98765 43210',
    placementOffice: 'Placement & Career Development Cell, Block C, Room 302',
    currentAcademicYear: '2024-2025'
  },
  policy: {
    dreamPackageThreshold: 10.0,
    superDreamThreshold: 25.0,
    maxOffersAllowed: 2,
    allowDreamUpgrade: true,
    requireResumeVerification: true,
    autoEligibilityCheck: true,
    strictAttendancePolicy: true
  },
  notifications: {
    emailOnNewDrive: true,
    emailOnShortlist: true,
    emailOnOffer: true,
    smsReminders: false,
    dailyTpoDigest: true,
    weeklyHodSummary: true
  }
};

export const settingsService = {
  getSettings: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return {
      ...settingsData,
      departments: [...departmentsList]
    };
  },

  updateInstitution: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    settingsData.institution = { ...settingsData.institution, ...data };
    return settingsData.institution;
  },

  updatePolicy: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    settingsData.policy = { ...settingsData.policy, ...data };
    return settingsData.policy;
  },

  updateNotifications: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    settingsData.notifications = { ...settingsData.notifications, ...data };
    return settingsData.notifications;
  },

  getDepartments: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [...departmentsList];
  },

  addDepartment: async (deptData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newDept = {
      ...deptData,
      id: `dept-${Date.now()}`,
      totalStudents: Number(deptData.totalStudents) || 120,
      placedStudents: 0,
      averagePackage: '6.0 LPA',
      highestPackage: '12.0 LPA'
    };
    departmentsList.push(newDept);
    return newDept;
  },

  updateDepartment: async (id, deptData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = departmentsList.findIndex((d) => d.id === id);
    if (index === -1) throw new Error('Department not found');
    departmentsList[index] = { ...departmentsList[index], ...deptData };
    return departmentsList[index];
  },

  deleteDepartment: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    departmentsList = departmentsList.filter((d) => d.id !== id);
    return { success: true };
  }
};
