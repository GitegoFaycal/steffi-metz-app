import api from './axiosConfig';

export const getTestimonials = async () => {
  const response = await api.get('/testimonials');
  return response.data;
};

export const getTestimonialById = async (id) => {
  const response = await api.get(`/testimonials/${id}`);
  return response.data;
};

export const createTestimonial = async (data) => {
  const response = await api.post('/testimonials', data);
  return response.data;
};

export const updateTestimonial = async (id, data) => {
  const response = await api.put(`/testimonials/${id}`, data);
  return response.data;
};

export const deleteTestimonial = async (id) => {
  const response = await api.delete(`/testimonials/${id}`);
  return response.data;
};

export const searchTestimonials = async (keyword) => {
  const response = await api.get(`/testimonials/search?keyword=${keyword}`);
  return response.data;
};