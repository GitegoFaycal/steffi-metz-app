import api from './axiosConfig';

export const getGallery = async () => {
  const response = await api.get('/gallery');
  return response.data;
};

export const uploadGalleryImage = async (formData) => {
  const response = await api.post('/gallery', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateGalleryImage = async (id, formData) => {
  const response = await api.put(`/gallery/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteGalleryImage = async (id) => {
  const response = await api.delete(`/gallery/${id}`);
  return response.data;
};