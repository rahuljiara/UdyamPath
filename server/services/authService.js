import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const registerUser = async ({ name, email, password, role, avatar }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Check if user already exists
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error('User already exists with this email address');
    error.statusCode = 409;
    throw error;
  }

  // Normalize role
  let userRole = (role || 'STUDENT').toUpperCase();
  if (userRole === 'MANAGER') userRole = 'HOD';

  // Create user (password will be hashed via Mongoose pre-save)
  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: userRole,
    avatar: avatar || ''
  });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive
    },
    token
  };
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  // Find user and explicitly select password
  const user = await User.findOne({ email: normalizedEmail }).select('+password');
  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error('Your account has been deactivated. Please contact Administrator.');
    error.statusCode = 401;
    throw error;
  }

  // Verify password with bcrypt
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Update last login timestamp
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken(user._id, user.role);

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
      lastLogin: user.lastLogin
    },
    token
  };
};

export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

export default {
  registerUser,
  loginUser,
  getUserProfile
};
