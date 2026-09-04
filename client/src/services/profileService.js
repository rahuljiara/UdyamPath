let userProfile = {
  id: 'usr-1',
  name: 'Dr. Rahul Deshmukh',
  title: 'Head Placement Officer (TPO)',
  department: 'Training & Placement Cell',
  employeeId: 'EMP-TPO-2018',
  email: 'tpo@college.edu.in',
  phone: '+91 98765 43210',
  altEmail: 'r.deshmukh@nite.ac.in',
  officeLocation: 'Block C, Room 302, Academic Quadrangle',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80',
  bio: 'Leading campus recruitment, corporate partnerships, and career enablement for engineering students since 2018. Passionate about connecting ambitious student talent with industry-leading technology innovators.',
  joinedDate: '2018-06-15',
  role: 'Admin / TPO',
  status: 'Active',
  twoFactorEnabled: true,
  lastLogin: new Date().toISOString()
};

let activeSessions = [
  {
    id: 'sess-1',
    device: 'Chrome on Windows 11 (Current)',
    ip: '192.168.1.45',
    location: 'Campus Network, Admin Block',
    lastActive: 'Active Now',
    isCurrent: true
  },
  {
    id: 'sess-2',
    device: 'Safari on iPhone 15 Pro',
    ip: '103.22.45.18',
    location: 'Mumbai, India',
    lastActive: '2 hours ago',
    isCurrent: false
  }
];

export const profileService = {
  getProfile: async () => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    return {
      ...userProfile,
      sessions: [...activeSessions]
    };
  },

  updateProfile: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    userProfile = { ...userProfile, ...data, updatedAt: new Date().toISOString() };
    return userProfile;
  },

  changePassword: async ({ currentPassword, newPassword }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!currentPassword) throw new Error('Current password is required');
    if (newPassword.length < 6) throw new Error('New password must be at least 6 characters');
    return { success: true, message: 'Password updated successfully!' };
  },

  toggleTwoFactor: async (enabled) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    userProfile.twoFactorEnabled = enabled;
    return { success: true, twoFactorEnabled: enabled };
  },

  terminateSession: async (sessionId) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    activeSessions = activeSessions.filter((s) => s.id !== sessionId);
    return { success: true };
  }
};
