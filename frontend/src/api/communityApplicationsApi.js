import api from './axiosConfig';

export const submitCommunityApplication = async (data) => {
  const response = await api.post('/community-applications', data);
  return response.data;
};

export const getCommunityApplications = async () => {
  const response = await api.get('/community-applications');
  return response.data;
};

export const getCommunityApplicationById = async (id) => {
  const response = await api.get(`/community-applications/${id}`);
  return response.data;
};

export const updateCommunityApplicationStatus = async (id, data) => {
  const response = await api.put(`/community-applications/${id}/status`, data);
  return response.data;
};

export const deleteCommunityApplication = async (id) => {
  const response = await api.delete(`/community-applications/${id}`);
  return response.data;
};