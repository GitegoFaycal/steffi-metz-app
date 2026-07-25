import api from './axiosConfig';

export const loginAdmin = async (credentials) => {
  const response = await api.post('/auth/login', credentials);

  if (response.data?.token) {
    localStorage.setItem('adminToken', response.data.token);
  }

  if (response.data?.user) {
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
  }

  return response.data;
};

export const setupAdmin = async (data) => {
  const response = await api.post('/auth/setup-admin', data);
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const getAdminToken = () => {
  return localStorage.getItem('adminToken');
};

export const getAdminUser = () => {
  const user = localStorage.getItem('adminUser');

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    localStorage.removeItem('adminUser');
    return null;
  }
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
};