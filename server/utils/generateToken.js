import jwt from 'jsonwebtoken';

/**
 * Generate JWT token with user id and role payload
 */
export const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'udyampath_jwt_secret_super_secure_key_2025';
  return jwt.sign({ id: userId, role }, secret, {
    expiresIn: '7d'
  });
};

export default generateToken;
