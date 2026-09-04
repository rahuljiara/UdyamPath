/**
 * Simple asyncHandler to catch asynchronous errors and forward to centralized error middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
