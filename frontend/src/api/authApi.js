import api from './axiosConfig';

export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
  }

  return response.data;
};

export const getLoggedInAdmin = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const getAdminUser = () => {
  const user = localStorage.getItem('adminUser');

  if (!user) {
    return null;
  }

  return JSON.parse(user);
};

export const isAdminLoggedIn = () => {
  return Boolean(localStorage.getItem('adminToken'));
};