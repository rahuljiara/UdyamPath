export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',

  STUDENTS: {
    ROOT: '/students',
    CREATE: '/students/create',
    DETAILS: (id) => `/students/${id}`,
    EDIT: (id) => `/students/${id}/edit`
  },

  COMPANIES: {
    ROOT: '/companies',
    CREATE: '/companies/create',
    DETAILS: (id) => `/companies/${id}`,
    EDIT: (id) => `/companies/${id}/edit`
  },

  DRIVES: {
    ROOT: '/placement-drives',
    CREATE: '/placement-drives/create',
    DETAILS: (id) => `/placement-drives/${id}`,
    EDIT: (id) => `/placement-drives/${id}/edit`
  },

  APPLICATIONS: {
    ROOT: '/applications',
    DETAILS: (id) => `/applications/${id}`
  },

  INTERVIEWS: {
    ROOT: '/interviews'
  },

  OFFERS: {
    ROOT: '/offers'
  },

  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  CALENDAR: '/calendar',
  SETTINGS: '/settings',
  AUDIT_LOGS: '/audit-logs',
  NOTIFICATIONS: '/notifications',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register'
};
