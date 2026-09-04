/**
 * Role-based access control middleware
 * Checks if authenticated user has one of the allowed roles
 */
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      return next(new Error('User authentication required'));
    }

    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map((r) => r.toUpperCase());

    // Map 'MANAGER' alias to HOD or TPO for frontend compatibility
    const expandedAllowed = new Set(normalizedAllowed);
    if (normalizedAllowed.includes('MANAGER')) {
      expandedAllowed.add('HOD');
      expandedAllowed.add('TPO');
    }
    if (normalizedAllowed.includes('TPO') || normalizedAllowed.includes('HOD')) {
      expandedAllowed.add('ADMIN'); // Admin can always access TPO/HOD features
    }

    if (userRole === 'ADMIN' || expandedAllowed.has(userRole)) {
      return next();
    }

    res.status(403);
    return next(
      new Error(
        `Forbidden: Role '${req.user.role}' is not authorized to access this resource`
      )
    );
  };
};

export default authorizeRoles;
