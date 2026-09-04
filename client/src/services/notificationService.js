let notificationsList = [
  {
    id: 'notif-1',
    title: 'Microsoft SDE-1 Drive Deadline',
    desc: 'Application window closes in 48 hours for 2021-2025 batch.',
    category: 'Drive',
    time: '10m ago',
    unread: true,
    link: '/placement-drives/drive-1',
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    title: 'New Candidate Application',
    desc: 'Devansh Verma (CSE, CGPA 8.45) submitted application for Zomato.',
    category: 'Application',
    time: '1h ago',
    unread: true,
    link: '/applications/app-3',
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-3',
    title: 'Interview Scheduled',
    desc: 'Technical Interview 2 configured for Microsoft SDE-1 on 15 March.',
    category: 'Interview',
    time: '3h ago',
    unread: true,
    link: '/interviews',
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-4',
    title: 'Offer Letter Confirmed',
    desc: 'Ananya Deshpande accepted offer from Zomato (28.0 LPA).',
    category: 'Offer',
    time: '5h ago',
    unread: false,
    link: '/offers',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-5',
    title: 'TCS Digital Drive Published',
    desc: 'Campus recruitment drive opened with 120 vacancies across all departments.',
    category: 'Drive',
    time: '1d ago',
    unread: false,
    link: '/placement-drives/drive-4',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-6',
    title: 'System Policy Updated',
    desc: 'Dream CTC cut-off threshold updated to 10.0 LPA.',
    category: 'System',
    time: '2d ago',
    unread: false,
    link: '/settings',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

// Event listeners for real-time unread counter syncing
const listeners = new Set();

const notifyListeners = () => {
  listeners.forEach((listener) => listener([...notificationsList]));
};

export const notificationService = {
  subscribe: (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getAll: async (params = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    let result = [...notificationsList];

    if (params.category && params.category !== 'All') {
      result = result.filter((n) => n.category === params.category);
    }
    if (params.unreadOnly) {
      result = result.filter((n) => n.unread);
    }

    return result;
  },

  getUnreadCount: () => {
    return notificationsList.filter((n) => n.unread).length;
  },

  markAsRead: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    const index = notificationsList.findIndex((n) => n.id === id);
    if (index !== -1) {
      notificationsList[index] = { ...notificationsList[index], unread: false };
      notifyListeners();
    }
    return { success: true };
  },

  markAllAsRead: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    notificationsList = notificationsList.map((n) => ({ ...n, unread: false }));
    notifyListeners();
    return { success: true };
  },

  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 30));
    notificationsList = notificationsList.filter((n) => n.id !== id);
    notifyListeners();
    return { success: true };
  },

  clearAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    notificationsList = [];
    notifyListeners();
    return { success: true };
  }
};
