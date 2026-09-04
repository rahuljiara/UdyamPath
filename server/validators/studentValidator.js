/**
 * Student input validation middleware
 */
export const validateStudentInput = (req, res, next) => {
  const { studentId, firstName, lastName, email, department, cgpa } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!studentId || !studentId.trim()) errors.push('Student ID / Roll number is required');
    if (!firstName || !firstName.trim()) errors.push('First name is required');
    if (!lastName || !lastName.trim()) errors.push('Last name is required');
    if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push('A valid email address is required');
    }
    if (!department || !department.trim()) errors.push('Department is required');
    if (cgpa === undefined || isNaN(cgpa) || Number(cgpa) < 0 || Number(cgpa) > 10) {
      errors.push('CGPA must be a number between 0.0 and 10.0');
    }
  } else if (req.method === 'PUT') {
    if (cgpa !== undefined && (isNaN(cgpa) || Number(cgpa) < 0 || Number(cgpa) > 10)) {
      errors.push('CGPA must be a number between 0.0 and 10.0');
    }
    if (email && !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errors.push('A valid email address is required');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Student validation failed',
      errors
    });
  }

  next();
};
