let auditLogsList = [
  {
    id: 'log-1',
    action: 'OFFER_ISSUED',
    category: 'Placement',
    severity: 'Success',
    user: 'Prof. Ramesh K. Verma',
    userRole: 'Head TPO',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
    entity: 'Student: Rahul Sharma',
    entityType: 'Offer',
    details: 'Recorded placement offer for Microsoft SDE-1 (44.0 LPA).',
    ipAddress: '192.168.1.45',
    timestamp: '2025-03-10T14:35:00Z'
  },
  {
    id: 'log-2',
    action: 'STAGE_ADVANCED',
    category: 'Application',
    severity: 'Info',
    user: 'Prof. Ramesh K. Verma',
    userRole: 'Head TPO',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
    entity: 'Student: Devansh Verma',
    entityType: 'Application',
    details: 'Moved candidate application to Technical Interview stage for Microsoft drive.',
    ipAddress: '192.168.1.45',
    timestamp: '2025-03-10T11:20:00Z'
  },
  {
    id: 'log-3',
    action: 'DRIVE_PUBLISHED',
    category: 'Drive',
    severity: 'Success',
    user: 'Dr. Rahul Deshmukh',
    userRole: 'TPO Officer',
    userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=128&auto=format&fit=crop&q=60',
    entity: 'Drive: Zomato Backend SDE',
    entityType: 'Drive',
    details: 'Published campus placement drive for B.Tech CSE/IT with 28.0 LPA package.',
    ipAddress: '192.168.1.18',
    timestamp: '2025-03-09T16:45:00Z'
  },
  {
    id: 'log-4',
    action: 'POLICY_MODIFIED',
    category: 'System',
    severity: 'Warning',
    user: 'Dr. Arisudan Sharma',
    userRole: 'HOD CSE',
    userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=128&auto=format&fit=crop&q=60',
    entity: 'Policy: Dream Threshold',
    entityType: 'Settings',
    details: 'Updated Dream package threshold from 8.0 LPA to 10.0 LPA.',
    ipAddress: '192.168.1.102',
    timestamp: '2025-03-08T09:15:00Z'
  },
  {
    id: 'log-5',
    action: 'INTERVIEW_SCHEDULED',
    category: 'Interview',
    severity: 'Info',
    user: 'Prof. Ramesh K. Verma',
    userRole: 'Head TPO',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
    entity: 'Candidate: Rhea Chatterjee',
    entityType: 'Interview',
    details: 'Scheduled Case Study round with Deloitte panel for 15 March 02:00 PM.',
    ipAddress: '192.168.1.45',
    timestamp: '2025-03-07T15:00:00Z'
  },
  {
    id: 'log-6',
    action: 'STUDENT_VERIFIED',
    category: 'Student',
    severity: 'Success',
    user: 'Dr. Meenakshi Sundaram',
    userRole: 'HOD IT',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128&auto=format&fit=crop&q=60',
    entity: 'Student: Ananya Deshpande',
    entityType: 'Student',
    details: 'Approved resume PDF and academic CGPA verification (9.35 / 10.0).',
    ipAddress: '192.168.1.55',
    timestamp: '2025-03-06T10:30:00Z'
  },
  {
    id: 'log-7',
    action: 'SECURITY_LOGIN',
    category: 'Security',
    severity: 'Info',
    user: 'Prof. Ramesh K. Verma',
    userRole: 'Head TPO',
    userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&auto=format&fit=crop&q=60',
    entity: 'Session: Auth Token Issued',
    entityType: 'Auth',
    details: 'Successful TPO administrative login via Chrome Windows (2FA verified).',
    ipAddress: '192.168.1.45',
    timestamp: '2025-03-05T08:00:00Z'
  }
];

export const auditService = {
  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 60));
    let result = [...auditLogsList];

    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.action.toLowerCase().includes(q) ||
          l.user.toLowerCase().includes(q) ||
          l.entity.toLowerCase().includes(q) ||
          l.details.toLowerCase().includes(q) ||
          l.ipAddress.includes(q)
      );
    }
    if (params.category && params.category !== 'All') {
      result = result.filter((l) => l.category === params.category);
    }
    if (params.severity && params.severity !== 'All') {
      result = result.filter((l) => l.severity === params.severity);
    }

    const total = result.length;
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 8;
    const start = (page - 1) * limit;
    const paginated = result.slice(start, start + limit);

    return {
      logs: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1
    };
  },

  getStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 40));
    return {
      totalLogs: auditLogsList.length,
      placementActions: auditLogsList.filter((l) => l.category === 'Placement' || l.category === 'Drive').length,
      systemModifications: auditLogsList.filter((l) => l.category === 'System' || l.severity === 'Warning').length,
      securityEvents: auditLogsList.filter((l) => l.category === 'Security').length
    };
  },

  clearLogs: async () => {
    await new Promise((resolve) => setTimeout(resolve, 80));
    auditLogsList = [];
    return { success: true };
  }
};
