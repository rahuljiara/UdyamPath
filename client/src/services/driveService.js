import initialDrives from '../data/placementDrives.json';
import initialApplications from '../data/applications.json';
import initialInterviews from '../data/interviews.json';

let drivesList = [...initialDrives];
let applicationsList = [...initialApplications];
let interviewsList = [...initialInterviews];

export const driveService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...drivesList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.companyName.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q) ||
          d.driveId.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((d) => d.status === params.status);
    }
    if (params.company && params.company !== 'All') {
      result = result.filter((d) => d.companyName === params.company || d.companyId === params.company);
    }
    if (params.jobType && params.jobType !== 'All') {
      result = result.filter((d) => d.jobType === params.jobType);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      drives: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const totalDrives = drivesList.length;
    const activeDrives = drivesList.filter((d) => d.status === 'Open' || d.status === 'In Progress').length;
    const totalOpenings = drivesList.reduce((sum, d) => sum + (Number(d.openings) || 0), 0);
    const totalApplications = drivesList.reduce((sum, d) => sum + (Number(d.applicationsCount) || 0), 0);

    return {
      totalDrives,
      activeDrives,
      totalOpenings,
      totalApplications
    };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const drive = drivesList.find((d) => d.id === id || d.driveId === id);
    if (!drive) throw new Error('Placement drive not found');
    return drive;
  },

  getDriveApplications: async (driveId) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return applicationsList.filter((a) => a.driveId === driveId);
  },

  getDriveInterviews: async (driveId, companyName) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return interviewsList.filter(
      (i) => i.companyName?.toLowerCase() === companyName?.toLowerCase()
    );
  },

  applyToDrive: async (driveId, student) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const drive = drivesList.find((d) => d.id === driveId || d.driveId === driveId);
    if (!drive) throw new Error('Placement drive not found');

    // Prevent duplicate application
    const existing = applicationsList.find(
      (a) => (a.driveId === drive.id || a.driveId === drive.driveId) && (a.studentId === student.id || a.studentEmail === student.email)
    );
    if (existing) {
      throw new Error('You have already submitted an application for this placement drive.');
    }

    const newApp = {
      id: `app-${Date.now()}`,
      applicationId: `APP2025-${String(applicationsList.length + 1).padStart(3, '0')}`,
      studentId: student.id,
      studentName: student.fullName,
      studentEmail: student.email,
      studentDepartment: student.deptCode || 'CSE',
      studentCgpa: student.cgpa,
      studentAvatar: student.avatar,
      driveId: drive.id,
      companyName: drive.companyName,
      position: drive.title,
      appliedAt: new Date().toISOString(),
      currentStage: 'Application',
      status: 'Applied',
      notes: 'Applied through candidate portal.'
    };

    applicationsList.unshift(newApp);

    // Increment drive application count
    drive.applicationsCount = (drive.applicationsCount || 0) + 1;

    return newApp;
  },

  create: async (driveData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      driveId: driveData.driveId || `DRV${new Date().getFullYear()}${String(drivesList.length + 1).padStart(2, '0')}`,
      applicationsCount: 0,
      shortlistedCount: 0,
      status: driveData.status || 'Open',
      eligibility: {
        minCgpa: Number(driveData.minCgpa) || 6.5,
        maxBacklogs: Number(driveData.maxBacklogs) || 0,
        departments: Array.isArray(driveData.departments) ? driveData.departments : ['Computer Science & Engineering', 'Information Technology'],
        courses: Array.isArray(driveData.courses) ? driveData.courses : ['B.Tech'],
        batches: Array.isArray(driveData.batches) ? driveData.batches : ['2021-2025']
      },
      selectionProcess: Array.isArray(driveData.selectionProcess)
        ? driveData.selectionProcess
        : (driveData.selectionProcess || '').split('\n').filter(Boolean),
      createdAt: new Date().toISOString()
    };
    drivesList.unshift(newDrive);
    return newDrive;
  },

  update: async (id, driveData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = drivesList.findIndex((d) => d.id === id || d.driveId === id);
    if (index === -1) throw new Error('Placement drive not found');

    const updated = {
      ...drivesList[index],
      ...driveData,
      eligibility: {
        minCgpa: Number(driveData.minCgpa ?? drivesList[index].eligibility?.minCgpa) || 6.5,
        maxBacklogs: Number(driveData.maxBacklogs ?? drivesList[index].eligibility?.maxBacklogs) || 0,
        departments: driveData.departments || drivesList[index].eligibility?.departments || [],
        courses: driveData.courses || drivesList[index].eligibility?.courses || [],
        batches: driveData.batches || drivesList[index].eligibility?.batches || []
      },
      selectionProcess: Array.isArray(driveData.selectionProcess)
        ? driveData.selectionProcess
        : typeof driveData.selectionProcess === 'string'
        ? driveData.selectionProcess.split('\n').filter(Boolean)
        : drivesList[index].selectionProcess,
      updatedAt: new Date().toISOString()
    };
    drivesList[index] = updated;
    return updated;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    drivesList = drivesList.filter((d) => d.id !== id && d.driveId !== id);
    return { success: true };
  }
};
