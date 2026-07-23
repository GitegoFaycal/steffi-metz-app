import api from './axiosConfig';

export const getHomepage = async () => {
  const response = await api.get('/homepage');
  return response.data;
};

export const updateHomepage = async (data) => {
  const response = await api.put('/homepage', data);
  return response.data;
};

export const updateHomepageWithImage = async (formData) => {
  const response = await api.put('/homepage/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};