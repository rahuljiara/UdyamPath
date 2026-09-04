/**
 * Company validation middleware
 */
export const validateCompanyInput = (req, res, next) => {
  const { name, industry } = req.body;
  const errors = [];

  if (req.method === 'POST') {
    if (!name || !name.trim()) errors.push('Company name is required');
    if (!industry || !industry.trim()) errors.push('Industry sector is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Company validation failed',
      errors
    });
  }

  next();
};
