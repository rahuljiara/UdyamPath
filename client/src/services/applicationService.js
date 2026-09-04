import initialApplications from '../data/applications.json';

let applicationsList = [...initialApplications];

export const applicationService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...applicationsList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.studentName.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q) ||
          a.position.toLowerCase().includes(q) ||
          a.applicationId.toLowerCase().includes(q) ||
          a.studentEmail.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((a) => a.status === params.status);
    }
    if (params.stage && params.stage !== 'All') {
      result = result.filter((a) => a.currentStage === params.stage);
    }
    if (params.department && params.department !== 'All') {
      result = result.filter((a) => a.studentDepartment === params.department);
    }
    if (params.company && params.company !== 'All') {
      result = result.filter((a) => a.companyName === params.company);
    }
    if (params.driveId && params.driveId !== 'All') {
      result = result.filter((a) => a.driveId === params.driveId);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      applications: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const total = applicationsList.length;
    const underReview = applicationsList.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length;
    const shortlisted = applicationsList.filter((a) => a.status === 'Shortlisted').length;
    const selected = applicationsList.filter((a) => a.status === 'Selected').length;
    const rejected = applicationsList.filter((a) => a.status === 'Rejected').length;

    return {
      total,
      underReview,
      shortlisted,
      selected,
      rejected
    };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const app = applicationsList.find((a) => a.id === id || a.applicationId === id);
    if (!app) throw new Error('Application not found');
    return app;
  },

  updateStatus: async (id, updateData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = applicationsList.findIndex((a) => a.id === id || a.applicationId === id);
    if (index === -1) throw new Error('Application not found');

    const updated = {
      ...applicationsList[index],
      status: updateData.status !== undefined ? updateData.status : applicationsList[index].status,
      currentStage: updateData.currentStage !== undefined ? updateData.currentStage : applicationsList[index].currentStage,
      notes: updateData.notes !== undefined ? updateData.notes : applicationsList[index].notes,
      rejectionReason: updateData.rejectionReason !== undefined ? updateData.rejectionReason : applicationsList[index].rejectionReason,
      updatedAt: new Date().toISOString()
    };

    applicationsList[index] = updated;
    return updated;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    applicationsList = applicationsList.filter((a) => a.id !== id && a.applicationId !== id);
    return { success: true };
  }
};
