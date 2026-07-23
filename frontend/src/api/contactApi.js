import api from './axiosConfig';

export const sendContactMessage = async (data) => {
  const response = await api.post('/contact-messages', data);
  return response.data;
};

export const getContactMessages = async () => {
  const response = await api.get('/contact-messages');
  return response.data;
};

export const getContactMessageById = async (id) => {
  const response = await api.get(`/contact-messages/${id}`);
  return response.data;
};

export const markMessageAsRead = async (id) => {
  const response = await api.put(`/contact-messages/${id}/read`);
  return response.data;
};

export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/contact-messages/${id}`);
  return response.data;
};

export const searchContactMessages = async (keyword) => {
  const response = await api.get(`/contact-messages/search?keyword=${keyword}`);
  return response.data;
};