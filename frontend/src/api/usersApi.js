import api from './axiosConfig';

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createUser = async (data) => {
  const response = await api.post('/users', data);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

export const updateUserPassword = async (id, data) => {
  const response = await api.put(`/users/${id}/password`, data);
  return response.data;
};

export const searchUsers = async (keyword) => {
  const response = await api.get(`/users/search?keyword=${keyword}`);
  return response.data;
};