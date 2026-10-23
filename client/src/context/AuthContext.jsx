import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  STUDENT: 'student',
  RECRUITER: 'recruiter'
};

const normalizeRole = (role) => {
  if (!role) return USER_ROLES.STUDENT;
  const upper = String(role).toUpperCase();
  if (upper === 'ADMIN' || upper === 'TPO') return USER_ROLES.ADMIN;
  if (upper === 'HOD' || upper === 'MANAGER') return USER_ROLES.MANAGER;
  if (upper === 'STUDENT') return USER_ROLES.STUDENT;
  if (upper === 'RECRUITER') return USER_ROLES.RECRUITER;
  return role.toLowerCase();
};

const formatUser = (user) => {
  if (!user) return null;
  const role = normalizeRole(user.role);
  const rawRole = (user.rawRole || user.roleBadge || user.role || '').toUpperCase();
  
  const roleTitle =
    user.roleTitle ||
    (rawRole === 'TPO'
      ? 'Head TPO / Director'
      : rawRole === 'ADMIN'
      ? 'Institutional Admin'
      : rawRole === 'HOD' || role === USER_ROLES.MANAGER
      ? `HOD (${user.deptCode || user.department || 'Department'})`
      : rawRole === 'RECRUITER' || role === USER_ROLES.RECRUITER
      ? `Recruiter (${user.company || 'Partner'})`
      : 'Candidate (Student)');

  const roleBadge =
    user.roleBadge ||
    (rawRole === 'TPO'
      ? 'TPO'
      : rawRole === 'ADMIN'
      ? 'ADMIN'
      : rawRole === 'HOD' || role === USER_ROLES.MANAGER
      ? `HOD ${user.deptCode || ''}`.trim()
      : rawRole === 'RECRUITER' || role === USER_ROLES.RECRUITER
      ? 'RECRUITER'
      : 'STUDENT');

  return {
    ...user,
    id: user._id || user.id,
    _id: user._id || user.id,
    role,
    rawRole,
    roleTitle,
    roleBadge,
    department: user.department || '',
    deptCode: user.deptCode || (user.department?.includes('Computer') ? 'CSE' : user.department?.includes('Information') ? 'IT' : ''),
    company: user.company || '',
    studentId: user.studentId || '',
    cgpa: user.cgpa,
    permissions: user.permissions || ['ALL']
  };
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('udyam_auth_user');
    if (saved) {
      try {
        return formatUser(JSON.parse(saved));
      } catch (err) {
        console.error('Error parsing stored user session:', err);
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(true);

  // Verify JWT session on initial application load
  useEffect(() => {
    const initSession = async () => {
      const token = authService.getToken();
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return;
      }

      try {
        const user = await authService.getMe();
        if (user) {
          const enhanced = formatUser(user);
          setCurrentUser(enhanced);
          localStorage.setItem('udyam_auth_user', JSON.stringify(enhanced));
        } else {
          setCurrentUser(null);
          authService.logout();
        }
      } catch (err) {
        console.warn('Session verification failed, clearing auth state:', err.message);
        authService.logout();
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    const user = data.user || data;
    const formatted = formatUser(user);
    setCurrentUser(formatted);
    localStorage.setItem('udyam_auth_user', JSON.stringify(formatted));
    return formatted;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    const user = data.user || data;
    const formatted = formatUser(user);
    setCurrentUser(formatted);
    localStorage.setItem('udyam_auth_user', JSON.stringify(formatted));
    return formatted;
  };

  const switchUser = async (email, password = 'password123') => {
    setLoading(true);
    try {
      const formatted = await login(email, password);
      return formatted;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const hasPermission = (permission) => {
    if (!currentUser) return false;
    if (currentUser.permissions?.includes('ALL')) return true;
    return currentUser.permissions?.includes(permission);
  };

  const currentRole = currentUser?.role || USER_ROLES.STUDENT;
  const isRole = (role) => currentRole === role;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentRole,
        loading,
        login,
        register,
        switchUser,
        logout,
        hasPermission,
        isRole,
        isAdmin: isRole(USER_ROLES.ADMIN),
        isManager: isRole(USER_ROLES.MANAGER),
        isStudent: isRole(USER_ROLES.STUDENT),
        isRecruiter: isRole(USER_ROLES.RECRUITER),
        isTpo: currentUser?.rawRole === 'TPO',
        isHod: currentUser?.rawRole === 'HOD' || isRole(USER_ROLES.MANAGER),
        isAuthenticated: !!currentUser
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

export default AuthContext;
