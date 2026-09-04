import initialStudents from '../data/students.json';
import initialCompanies from '../data/companies.json';
import initialOffers from '../data/offers.json';
import initialDrives from '../data/placementDrives.json';

export const reportService = {
  getReportData: async ({ reportType = 'summary', department = 'All', batch = '2021-2025', minCgpa = 0 }) => {
    await new Promise((resolve) => setTimeout(resolve, 80));

    let students = [...initialStudents];
    if (department !== 'All') {
      students = students.filter((s) => s.deptCode === department || s.department.toLowerCase().includes(department.toLowerCase()));
    }
    if (batch !== 'All') {
      students = students.filter((s) => s.batch === batch);
    }
    if (minCgpa > 0) {
      students = students.filter((s) => s.cgpa >= minCgpa);
    }

    if (reportType === 'unplaced') {
      const unplacedStudents = students.filter((s) => s.placementStatus === 'Unplaced');
      return {
        type: 'Unplaced Candidates Report',
        totalRecords: unplacedStudents.length,
        headers: ['Roll Number', 'Full Name', 'Department', 'CGPA', 'Backlogs', 'Primary Skills', 'Email'],
        rows: unplacedStudents.map((s) => [
          s.studentId,
          s.fullName,
          s.deptCode || 'CSE',
          s.cgpa,
          s.backlogs,
          Array.isArray(s.skills) ? s.skills.join(', ') : s.skills,
          s.email
        ])
      };
    }

    if (reportType === 'company') {
      return {
        type: 'Recruiter Performance Report',
        totalRecords: initialCompanies.length,
        headers: ['Company Name', 'Tier Category', 'Industry Sector', 'Total Drives', 'Offers Made', 'Average Package'],
        rows: initialCompanies.map((c) => [
          c.name,
          c.tier,
          c.sector,
          c.totalDrives || 1,
          c.offersCount || 10,
          c.averagePackage || '8.0 LPA'
        ])
      };
    }

    if (reportType === 'department') {
      const depts = [
        { name: 'Computer Science & Engineering', code: 'CSE', total: 420, placed: 358, rate: '85.2%', avgCtc: '12.4 LPA', highCtc: '44.0 LPA' },
        { name: 'Information Technology', code: 'IT', total: 240, placed: 204, rate: '85.0%', avgCtc: '10.8 LPA', highCtc: '28.0 LPA' },
        { name: 'Electronics & Communication', code: 'ECE', total: 300, placed: 218, rate: '72.6%', avgCtc: '7.8 LPA', highCtc: '18.5 LPA' },
        { name: 'Electrical & Electronics', code: 'EEE', total: 180, placed: 112, rate: '62.2%', avgCtc: '6.9 LPA', highCtc: '16.0 LPA' },
        { name: 'Mechanical Engineering', code: 'MECH', total: 200, placed: 98, rate: '49.0%', avgCtc: '6.2 LPA', highCtc: '12.0 LPA' }
      ];

      const filtered = department === 'All' ? depts : depts.filter((d) => d.code === department);
      return {
        type: 'Department-wise Placement Audit (NAAC/NIRF Format)',
        totalRecords: filtered.length,
        headers: ['Department Name', 'Branch Code', 'Total Enrolled', 'Total Placed', 'Placement Rate', 'Average Package', 'Highest Package'],
        rows: filtered.map((d) => [d.name, d.code, d.total, d.placed, d.rate, d.avgCtc, d.highCtc])
      };
    }

    // Default: Overall Summary / Placed Candidates
    const placedStudents = students.filter((s) => s.placementStatus === 'Placed');
    return {
      type: 'Campus Placement Summary & Offers Report',
      totalRecords: placedStudents.length,
      headers: ['Roll Number', 'Student Name', 'Department', 'CGPA', 'Hiring Company', 'Designation', 'Package (CTC)'],
      rows: placedStudents.map((s) => [
        s.studentId,
        s.fullName,
        s.deptCode || 'CSE',
        s.cgpa,
        s.placedCompany || 'Campus Recruiter',
        'Software Engineer',
        s.packageOffered || '8.5 LPA'
      ])
    };
  }
};
