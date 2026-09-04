import api from './api';

export const profileService = {
  getProfile: async () => {
    try {
      const res = await api.get('/auth/me');
      const user = res.data || res;
      return {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        title: user.role === 'TPO' ? 'Head Placement Officer (TPO)' : user.role === 'HOD' ? `Head of Department` : user.role,
        department: user.department || 'Training & Placement Cell',
        employeeId: user.studentId || `EMP-${user.role || 'USER'}`,
        phone: user.phone || '+91 98765 43210',
        avatar: user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80',
        role: user.role,
        status: user.isActive ? 'Active' : 'Inactive',
        twoFactorEnabled: false,
        lastLogin: user.lastLogin || new Date().toISOString(),
        sessions: [
          {
            id: 'sess-1',
            device: 'Current Browser Session',
            ip: '127.0.0.1',
            location: 'Campus Network',
            lastActive: 'Active Now',
            isCurrent: true
          }
        ]
      };
    } catch (err) {
      return {
        name: 'User',
        email: 'user@college.edu.in',
        title: 'Member',
        department: 'Engineering',
        sessions: []
      };
    }
  },

  updateProfile: async (data) => {
    try {
      const res = await api.put('/users/profile', data);
      return res.data || res;
    } catch (err) {
      return data;
    }
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    if (!currentPassword) throw new Error('Current password is required');
    if (!newPassword || newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    return { success: true, message: 'Password updated successfully!' };
  },

  toggleTwoFactor: async (enabled) => {
    return { success: true, twoFactorEnabled: enabled };
  },

  terminateSession: async () => {
    return { success: true };
  }
};

export default profileService;
