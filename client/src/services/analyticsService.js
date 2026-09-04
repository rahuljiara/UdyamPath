import initialDashboardStats from '../data/dashboardStats.json';

export const analyticsService = {
  getOverviewMetrics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return {
      totalStudents: 1340,
      eligibleStudents: 1150,
      placedStudents: 990,
      placementRate: '86.1%',
      totalOffers: 1140,
      highestPackage: '44.0 LPA',
      averagePackage: '8.4 LPA',
      medianPackage: '7.5 LPA',
      totalCompanies: 48,
      activeDrives: 6
    };
  },

  getDepartmentAnalytics: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [
      { dept: 'CSE', total: 420, placed: 358, unplaced: 62, rate: 85.2, avgCtc: 12.4, highestCtc: 44.0 },
      { dept: 'IT', total: 240, placed: 204, unplaced: 36, rate: 85.0, avgCtc: 10.8, highestCtc: 28.0 },
      { dept: 'ECE', total: 300, placed: 218, unplaced: 82, rate: 72.6, avgCtc: 7.8, highestCtc: 18.5 },
      { dept: 'EEE', total: 180, placed: 112, unplaced: 68, rate: 62.2, avgCtc: 6.9, highestCtc: 16.0 },
      { dept: 'MECH', total: 200, placed: 98, unplaced: 102, rate: 49.0, avgCtc: 6.2, highestCtc: 12.0 }
    ];
  },

  getSalaryDistribution: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { range: '< 5 LPA', count: 140, label: 'Standard' },
      { range: '5 - 10 LPA', count: 485, label: 'Core / IT' },
      { range: '10 - 20 LPA', count: 245, label: 'High CTC' },
      { range: '20 - 35 LPA', count: 88, label: 'Dream' },
      { range: '> 35 LPA', count: 32, label: 'Super Dream' }
    ];
  },

  getRecruitmentFunnel: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return initialDashboardStats.placementFunnel || [];
  },

  getSectorDistribution: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { sector: 'IT & Software', percentage: 48, color: '#2F8F78' },
      { sector: 'Product / SaaS', percentage: 22, color: '#38bdf8' },
      { sector: 'Consulting & FinTech', percentage: 16, color: '#f59e0b' },
      { sector: 'Core Engineering', percentage: 10, color: '#a855f7' },
      { sector: 'Others / EdTech', percentage: 4, color: '#94a3b8' }
    ];
  },

  getTopRecruiters: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return [
      { name: 'Tata Consultancy Services', offers: 120, highestCtc: '9.0 LPA', tier: 'Mass Recruit' },
      { name: 'Deloitte USI', offers: 65, highestCtc: '11.5 LPA', tier: 'Tier 1' },
      { name: 'Infosys BPM & Tech', offers: 55, highestCtc: '9.5 LPA', tier: 'Mass Recruit' },
      { name: 'Microsoft India', offers: 15, highestCtc: '44.0 LPA', tier: 'Super Dream' },
      { name: 'Zomato', offers: 10, highestCtc: '28.0 LPA', tier: 'Dream' },
      { name: 'Cisco Systems', offers: 8, highestCtc: '16.0 LPA', tier: 'Tier 1' }
    ];
  },

  getCgpaVsPlacement: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { bracket: '9.0 - 10.0', placedRate: 98.4, avgCtc: 18.2 },
      { bracket: '8.0 - 8.9', placedRate: 91.2, avgCtc: 11.5 },
      { bracket: '7.0 - 7.9', placedRate: 76.5, avgCtc: 7.4 },
      { bracket: '6.0 - 6.9', placedRate: 48.0, avgCtc: 5.2 },
      { bracket: '< 6.0', placedRate: 22.1, avgCtc: 4.1 }
    ];
  },

  getSkillDemand: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return [
      { skill: 'Data Structures & Algorithms', demand: 94 },
      { skill: 'React.js & Full-Stack', demand: 88 },
      { skill: 'Node.js & REST APIs', demand: 82 },
      { skill: 'SQL & Database Design', demand: 79 },
      { skill: 'System Design & Architecture', demand: 72 },
      { skill: 'Cloud (AWS / Azure)', demand: 68 },
      { skill: 'Python / Machine Learning', demand: 65 }
    ];
  }
};
