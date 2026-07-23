import api from './axiosConfig';

export const getBoxes = async () => {
  const response = await api.get('/boxes');
  return response.data;
};

export const getBoxById = async (id) => {
  const response = await api.get(`/boxes/${id}`);
  return response.data;
};

export const createBox = async (formData) => {
  const response = await api.post('/boxes', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateBox = async (id, formData) => {
  const response = await api.put(`/boxes/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteBox = async (id) => {
  const response = await api.delete(`/boxes/${id}`);
  return response.data;
};

export const searchBoxes = async (keyword) => {
  const response = await api.get(`/boxes/search?keyword=${keyword}`);
  return response.data;
};