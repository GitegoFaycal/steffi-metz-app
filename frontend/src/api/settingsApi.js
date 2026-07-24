import api from './axiosConfig';

export const getSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (data) => {
  const response = await api.put('/settings', data);
  return response.data;
};

export const updateSettingsWithLogo = async (formData) => {
  const response = await api.put('/settings/logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateShopImage = async (formData) => {
  const response = await api.put('/settings/shop-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};