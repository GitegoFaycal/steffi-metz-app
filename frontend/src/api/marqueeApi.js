import api from './axiosConfig';

export const getMarqueeItems = async () => {
  const response = await api.get('/marquee');
  return response.data;
};

export const getAdminMarqueeItems = async () => {
  const response = await api.get('/marquee/admin');
  return response.data;
};

export const createMarqueeItem = async (data) => {
  const response = await api.post('/marquee', data);
  return response.data;
};

export const updateMarqueeItem = async (id, data) => {
  const response = await api.put(`/marquee/${id}`, data);
  return response.data;
};

export const deleteMarqueeItem = async (id) => {
  const response = await api.delete(`/marquee/${id}`);
  return response.data;
};