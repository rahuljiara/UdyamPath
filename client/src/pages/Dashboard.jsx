import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { role, isManager, isStudent } = useAuth();

  if (isStudent) {
    return <StudentDashboard />;
  }

  if (isManager) {
    return <ManagerDashboard />;
  }

  return <AdminDashboard />;
};

export default Dashboard;
