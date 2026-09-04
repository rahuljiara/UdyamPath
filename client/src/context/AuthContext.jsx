import React, { createContext, useContext, useState, useEffect } from 'react';

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STUDENT: 'student'
};

// Predefined personas representing Admin, Manager (HOD), and Candidate (Student)
export const MOCK_USERS = [
  {
    id: 'usr-admin-1',
    name: 'Dr. Rahul Deshmukh',
    role: USER_ROLES.ADMIN,
    roleTitle: 'Head TPO / Director',
    roleBadge: 'Admin / HR Head',
    department: 'Institute Level',
    deptCode: 'ALL',
    email: 'tpo.director@college.edu.in',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
    permissions: ['ALL']
  },
  {
    id: 'usr-mgr-1',
    name: 'Dr. Arisudan Sharma',
    role: USER_ROLES.MANAGER,
    roleTitle: 'HOD & Dept Coordinator',
    roleBadge: 'Manager / HOD (CSE)',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    email: 'hod.cse@college.edu.in',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=60',
    permissions: ['DEPT_VIEW', 'DEPT_VERIFY', 'DEPT_REPORTS', 'DRIVES_VIEW', 'APPLICATIONS_VIEW']
  },
  {
    id: 'stud-1',
    name: 'Rahul Sharma',
    role: USER_ROLES.STUDENT,
    roleTitle: 'B.Tech CSE Candidate',
    roleBadge: 'Candidate',
    studentId: '21BCS045',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    batch: '2021-2025',
    cgpa: 9.42,
    backlogs: 0,
    email: 'rahul.sharma@college.edu.in',
    phone: '+91 98765 43210',
    placementStatus: 'Placed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=60',
    permissions: ['SELF_VIEW', 'APPLY_DRIVE', 'OFFERS_ACCEPT', 'PROFILE_EDIT']
  },
  {
    id: 'stud-3',
    name: 'Devansh Verma',
    role: USER_ROLES.STUDENT,
    roleTitle: 'B.Tech CSE Candidate',
    roleBadge: 'Candidate',
    studentId: '21BCS012',
    department: 'Computer Science & Engineering',
    deptCode: 'CSE',
    batch: '2021-2025',
    cgpa: 8.45,
    backlogs: 0,
    email: 'devansh.verma@college.edu.in',
    phone: '+91 98765 43212',
    placementStatus: 'In Process',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=128&auto=format&fit=crop&q=60',
    permissions: ['SELF_VIEW', 'APPLY_DRIVE', 'OFFERS_ACCEPT', 'PROFILE_EDIT']
  }
];

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('udyam_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const match = MOCK_USERS.find((u) => u.id === parsed.id);
        if (match) return match;
      } catch (err) {
        console.error('Error restoring user session:', err);
      }
    }
    return MOCK_USERS[0]; // Default to Admin
  });

  useEffect(() => {
    localStorage.setItem('udyam_auth_user', JSON.stringify(currentUser));
  }, [currentUser]);

  const switchUser = (userId) => {
    const target = MOCK_USERS.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const switchRole = (role) => {
    const target = MOCK_USERS.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.permissions.includes('ALL')) return true;
    return currentUser.permissions.includes(permission);
  };

  const isRole = (role) => currentUser?.role === role;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role || USER_ROLES.ADMIN,
        availableUsers: MOCK_USERS,
        switchUser,
        switchRole,
        hasPermission,
        isRole,
        isAdmin: isRole(USER_ROLES.ADMIN),
        isManager: isRole(USER_ROLES.MANAGER),
        isStudent: isRole(USER_ROLES.STUDENT)
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
