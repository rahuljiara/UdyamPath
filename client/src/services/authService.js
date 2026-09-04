import api from './api';

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    const data = res.data || res;
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('udyam_auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    const data = res.data || res;
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('udyam_auth_user', JSON.stringify(data.user));
    }
    return data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data || res;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('udyam_auth_user');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
