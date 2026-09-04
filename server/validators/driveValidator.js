/**
 * Placement Drive validation middleware
 */
export const validateDriveInput = (req, res, next) => {
  const { title, companyName, ctc, applicationDeadline } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!title || !title.trim()) errors.push('Job title is required');
    if (!companyName || !companyName.trim()) errors.push('Company name is required');
    if (!ctc || !ctc.trim()) errors.push('CTC package is required');
    if (!applicationDeadline) errors.push('Application deadline is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Drive validation failed',
      errors
    });
  }

  next();
};
