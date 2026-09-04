/**
 * Standardized API Response Helpers
 */
export const sendSuccess = (res, data, message = null, statusCode = 200) => {
  const response = {
    success: true,
    data
  };
  if (message) {
    response.message = message;
  }
  return res.status(statusCode).json(response);
};

export const sendPaginated = (res, data, pagination, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    pagination: {
      page: Number(pagination.page) || 1,
      limit: Number(pagination.limit) || 10,
      total: Number(pagination.total) || 0,
      totalPages: Number(pagination.totalPages) || 1
    }
  });
};

export const sendError = (res, message = 'Something went wrong', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };
  if (errors) {
    response.errors = errors;
  }
  return res.status(statusCode).json(response);
};
