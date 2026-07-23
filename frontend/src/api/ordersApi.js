import api from './axiosConfig';

export const createOrder = async (data) => {
  const response = await api.post('/orders', data);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/orders/${id}`);
  return response.data;
};

export const searchOrders = async (keyword) => {
  const response = await api.get(`/orders/search?keyword=${keyword}`);
  return response.data;
};

export const createPayment = async (data) => {
  const response = await api.post('/payments', data);
  return response.data;
};

export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};