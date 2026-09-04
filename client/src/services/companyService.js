import initialCompanies from '../data/companies.json';
import initialDrives from '../data/placementDrives.json';
import initialStudents from '../data/students.json';

let companiesList = [...initialCompanies];
let drivesList = [...initialDrives];
let studentsList = [...initialStudents];

export const companyService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...companiesList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.industry.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q) ||
          c.companyId.toLowerCase().includes(q)
      );
    }
    if (params.industry && params.industry !== 'All') {
      result = result.filter((c) => c.industry === params.industry);
    }
    if (params.type && params.type !== 'All') {
      result = result.filter((c) => c.type === params.type);
    }
    if (params.status && params.status !== 'All') {
      result = result.filter((c) => c.status === params.status);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 9;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      companies: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    const totalCompanies = companiesList.length;
    const activeCompanies = companiesList.filter((c) => c.status === 'Active').length;
    const totalHires = companiesList.reduce((sum, c) => sum + (c.totalHires || 0), 0);
    const activeDrivesCount = drivesList.filter((d) => d.status === 'Open' || d.status === 'In Progress').length;

    return {
      totalCompanies,
      activeCompanies,
      totalHires,
      activeDrivesCount
    };
  },

  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    const company = companiesList.find((c) => c.id === id || c.companyId === id);
    if (!company) throw new Error('Company not found');
    return company;
  },

  getCompanyDrives: async (companyId, companyName) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return drivesList.filter(
      (d) => d.companyId === companyId || (companyName && d.companyName.toLowerCase() === companyName.toLowerCase())
    );
  },

  getCompanyPlacedStudents: async (companyName) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    if (!companyName) return [];
    return studentsList.filter(
      (s) => s.placedCompany && s.placedCompany.toLowerCase().includes(companyName.toLowerCase())
    );
  },

  create: async (companyData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const newCompany = {
      ...companyData,
      id: `comp-${Date.now()}`,
      companyId: companyData.companyId || `COMP${String(companiesList.length + 1).padStart(3, '0')}`,
      status: companyData.status || 'Active',
      totalHires: 0,
      activeDrivesCount: 0,
      createdAt: new Date().toISOString()
    };
    companiesList.unshift(newCompany);
    return newCompany;
  },

  update: async (id, companyData) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    const index = companiesList.findIndex((c) => c.id === id || c.companyId === id);
    if (index === -1) throw new Error('Company not found');

    const updated = {
      ...companiesList[index],
      ...companyData,
      updatedAt: new Date().toISOString()
    };
    companiesList[index] = updated;
    return updated;
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    companiesList = companiesList.filter((c) => c.id !== id && c.companyId !== id);
    return { success: true };
  }
};
