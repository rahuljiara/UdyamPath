import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';

const Dashboard = () => {
  const { role, isManager, isStudent, isRecruiter } = useAuth();

  if (isStudent) {
    return <StudentDashboard />;
  }

  if (isManager) {
    return <ManagerDashboard />;
  }

  if (isRecruiter) {
    return <RecruiterDashboard />;
  }

  return <AdminDashboard />;
};

export default Dashboard;
