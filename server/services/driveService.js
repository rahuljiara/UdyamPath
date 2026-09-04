/**
 * Check if a student meets the eligibility criteria of a placement drive
 * @param {Object} student - Student document
 * @param {Object} drive - PlacementDrive document
 * @returns {Object} { eligible: boolean, reasons: string[] }
 */
export const isStudentEligible = (student, drive) => {
  const reasons = [];

  if (!student) {
    return { eligible: false, reasons: ['Student profile not found'] };
  }

  const eligibility = drive.eligibility || {};

  // 1. Minimum CGPA Check
  const minCgpa = eligibility.minCgpa !== undefined ? eligibility.minCgpa : 6.0;
  if ((Number(student.cgpa) || 0) < minCgpa) {
    reasons.push(`CGPA (${student.cgpa}) is below minimum required (${minCgpa})`);
  }

  // 2. Maximum Backlogs Check
  const maxBacklogs = eligibility.maxBacklogs !== undefined ? eligibility.maxBacklogs : 0;
  if ((Number(student.backlogs) || 0) > maxBacklogs) {
    reasons.push(`Active backlogs (${student.backlogs}) exceed maximum allowed (${maxBacklogs})`);
  }

  // 3. Department Check
  if (eligibility.departments && eligibility.departments.length > 0) {
    const studentDept = (student.department || '').toLowerCase();
    const studentDeptCode = (student.deptCode || '').toLowerCase();

    const matchesDept = eligibility.departments.some((d) => {
      const target = d.toLowerCase();
      return (
        target === studentDept ||
        target === studentDeptCode ||
        studentDept.includes(target) ||
        target.includes(studentDeptCode)
      );
    });

    if (!matchesDept) {
      reasons.push(`Department (${student.department}) is not eligible for this drive`);
    }
  }

  // 4. Batch Check
  if (eligibility.batches && eligibility.batches.length > 0) {
    const matchesBatch = eligibility.batches.some(
      (b) => b.trim() === (student.batch || '').trim()
    );
    if (!matchesBatch) {
      reasons.push(`Batch (${student.batch}) is not eligible for this drive`);
    }
  }

  // 5. Course Check
  if (eligibility.courses && eligibility.courses.length > 0) {
    const matchesCourse = eligibility.courses.some(
      (c) => c.toLowerCase() === (student.course || '').toLowerCase()
    );
    if (!matchesCourse) {
      reasons.push(`Course (${student.course}) is not eligible for this drive`);
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons
  };
};

export default {
  isStudentEligible
};
