import api from './axiosConfig';

export const loginAdmin = async (data) => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const getAdminProfile = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const setupAdmin = async (data) => {
  const response = await api.post('/auth/setup-admin', data);
  return response.data;
};