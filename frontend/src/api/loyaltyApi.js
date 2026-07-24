import api from './axiosConfig';

export const getLoyaltyTiers = async () => {
  const response = await api.get('/loyalty');
  return response.data;
};

export const getAdminLoyaltyTiers = async () => {
  const response = await api.get('/loyalty/admin');
  return response.data;
};

export const getLoyaltyTierById = async (id) => {
  const response = await api.get(`/loyalty/${id}`);
  return response.data;
};

export const createLoyaltyTier = async (data) => {
  const response = await api.post('/loyalty', data);
  return response.data;
};

export const updateLoyaltyTier = async (id, data) => {
  const response = await api.put(`/loyalty/${id}`, data);
  return response.data;
};

export const deleteLoyaltyTier = async (id) => {
  const response = await api.delete(`/loyalty/${id}`);
  return response.data;
};