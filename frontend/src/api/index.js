import api from './axiosConfig';
import { siteData } from '../data/siteData';

export async function getData(path = '') {
  try {
    // Loyalty is still local because we did not create /api/loyalty in backend
    if (path === '/loyalty') {
      return siteData.loyalty || [];
    }

    const response = await api.get(path);
    const data = response.data;

    // Backend returns { success: true, boxes: [...] }
    if (path === '/boxes') {
      return data.boxes || data.data || [];
    }

    // Backend returns { success: true, events: [...] }
    if (path === '/events') {
      return data.events || data.data || [];
    }

    return data;
  } catch {
    if (path === '/boxes') return siteData.boxes || [];
    if (path === '/events') return siteData.events || [];
    if (path === '/loyalty') return siteData.loyalty || [];

    return siteData;
  }
}

export async function login(email, password) {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token);
  }

  if (response.data.user) {
    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
  }

  return response.data;
}

export function logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminUser');
  localStorage.removeItem('token');
}

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return response.data;
}

export async function createPayment(payment) {
  const response = await api.post('/payments', payment);
  return response.data;
}

export async function submitNewsletter(email) {
  try {
    const response = await api.post('/newsletters', { email });
    return response.data;
  } catch {
    return { success: true };
  }
}

export function whatsapp(text) {
  const phone = siteData.wa || '250785211051';

  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`,
    '_blank'
  );
}