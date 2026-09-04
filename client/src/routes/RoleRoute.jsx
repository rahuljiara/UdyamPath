import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from './paths';

const RoleRoute = ({ children, allowedRoles }) => {
  const { role } = useAuth();

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If not authorized for this specific admin view, redirect to dashboard
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default RoleRoute;
