import initialInterviews from '../data/interviews.json';

let interviewsList = [...initialInterviews];

export const interviewService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...interviewsList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.studentName.toLowerCase().includes(q) ||
          i.companyName.toLowerCase().includes(q) ||
          i.position.toLowerCase().includes(q) ||
          i.interviewer.toLowerCase().includes(q) ||
          i.round.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((i) => i.status === params.status);
    }
    if (params.mode && params.mode !== 'All') {
      result = result.filter((i) => i.mode.toLowerCase().includes(params.mode.toLowerCase()));
    }
    if (params.company && params.company !== 'All') {
      result = result.filter((i) => i.companyName === params.company);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      interviews: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const total = interviewsList.length;
    const scheduled = interviewsList.filter((i) => i.status === 'Scheduled').length;
    const completed = interviewsList.filter((i) => i.status === 'Completed').length;
    const cancelled = interviewsList.filter((i) => i.status === 'Cancelled' || i.status === 'Rescheduled').length;

    return {
      total,
      scheduled,
      completed,
      cancelled
    };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const interview = interviewsList.find((i) => i.id === id);
    if (!interview) throw new Error('Interview slot not found');
    return interview;
  },

  schedule: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newInterview = {
      ...data,
      id: `int-${Date.now()}`,
      status: data.status || 'Scheduled',
      createdAt: new Date().toISOString()
    };
    interviewsList.unshift(newInterview);
    return newInterview;
  },

  update: async (id, data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = interviewsList.findIndex((i) => i.id === id);
    if (index === -1) throw new Error('Interview slot not found');

    const updated = {
      ...interviewsList[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    interviewsList[index] = updated;
    return updated;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    interviewsList = interviewsList.filter((i) => i.id !== id);
    return { success: true };
  }
};
