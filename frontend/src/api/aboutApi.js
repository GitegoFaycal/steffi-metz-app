import api from './axiosConfig';

export const getAbout = async () => {
  const response = await api.get('/about');
  return response.data;
};

export const updateAbout = async (data) => {
  const response = await api.put('/about', data);
  return response.data;
};

export const updateAboutWithImage = async (formData) => {
  const response = await api.put('/about/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};