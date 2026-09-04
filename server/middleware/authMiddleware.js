import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Protect routes: Authenticate JWT Bearer token
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const secret = process.env.JWT_SECRET || 'udyampath_jwt_secret_super_secure_key_2025';
      const decoded = jwt.verify(token, secret);

      // Find user from database without password
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401);
        throw new Error('User account not found or token is invalid');
      }

      if (!user.isActive) {
        res.status(401);
        throw new Error('User account is deactivated. Please contact Administrator.');
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error(error.message || 'Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no bearer token provided');
  }
});

export default protect;
