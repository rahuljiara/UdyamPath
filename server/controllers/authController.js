import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../services/authService.js';
import User from '../models/User.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, avatar } = req.body;
  const result = await registerUser({ name, email, password, role, avatar });
  return sendSuccess(res, result, 'User registered successfully', 201);
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });
  return sendSuccess(res, result, 'Login successful', 200);
});

/**
 * @desc    Logout user / clear session
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  return sendSuccess(res, null, 'Logged out successfully', 200);
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await getUserProfile(req.user._id);
  return sendSuccess(res, user, 'Profile retrieved successfully', 200);
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

  const updatedUser = await user.save();
  return sendSuccess(res, updatedUser, 'Profile updated successfully', 200);
});

/**
 * @desc    Change user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters long');
  }

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await user.matchPassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Incorrect current password');
  }

  user.password = newPassword;
  await user.save();

  return sendSuccess(res, null, 'Password changed successfully', 200);
});
