import dashboardStats from '../data/dashboardStats.json';
import placementDrives from '../data/placementDrives.json';
import applications from '../data/applications.json';
import interviews from '../data/interviews.json';

export const dashboardService = {
  getOverview: async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return dashboardStats.overview;
  },

  getPlacementFunnel: async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return dashboardStats.placementFunnel;
  },

  getMonthlyTrend: async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return dashboardStats.monthlyTrend;
  },

  getDepartmentDistribution: async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return dashboardStats.departmentDistribution;
  },

  getActiveDrives: async (limit = 4) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return placementDrives.filter(d => d.status === 'Open' || d.status === 'In Progress').slice(0, limit);
  },

  getRecentApplications: async (limit = 5) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return applications.slice(0, limit);
  },

  getUpcomingInterviews: async (limit = 4) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    return interviews.filter(i => i.status === 'Scheduled').slice(0, limit);
  }
};
