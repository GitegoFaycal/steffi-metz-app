import api from './axiosConfig';

export const subscribeNewsletter = async (data) => {
  const response = await api.post('/newsletters', data);
  return response.data;
};

export const getNewsletters = async () => {
  const response = await api.get('/newsletters');
  return response.data;
};

export const deleteNewsletter = async (id) => {
  const response = await api.delete(`/newsletters/${id}`);
  return response.data;
};