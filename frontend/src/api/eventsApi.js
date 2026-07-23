import api from './axiosConfig';

export const getEvents = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const getEventById = async (id) => {
  const response = await api.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (formData) => {
  const response = await api.post('/events', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const updateEvent = async (id, formData) => {
  const response = await api.put(`/events/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await api.delete(`/events/${id}`);
  return response.data;
};

export const searchEvents = async (keyword) => {
  const response = await api.get(`/events/search?keyword=${keyword}`);
  return response.data;
};