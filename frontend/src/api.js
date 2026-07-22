import { siteData } from './data/siteData';
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function getToken(){ return localStorage.getItem('token') || ''; }
export function setToken(token){ localStorage.setItem('token', token); }
export function logout(){ localStorage.removeItem('token'); }

async function request(path='', options={}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function getData(path='') {
  try { return await request(path); }
  catch {
    if(path==='/boxes') return siteData.boxes;
    if(path==='/events') return siteData.events;
    if(path==='/loyalty') return siteData.loyalty;
    return siteData;
  }
}

export async function login(email, password){
  const data = await request('/auth/login', { method:'POST', body: JSON.stringify({ email, password }) });
  setToken(data.token);
  return data;
}
export async function createOrder(order){ return request('/order', { method:'POST', body: JSON.stringify(order) }); }
export async function createPayment(payment){ return request('/payment/create', { method:'POST', body: JSON.stringify(payment) }); }
export async function getAdminSummary(){ return request('/admin/summary'); }
export async function getAdminOrders(){ return request('/admin/orders'); }
export async function updateOrderStatus(id, status){ return request(`/admin/orders/${id}/status`, { method:'PATCH', body: JSON.stringify({ status }) }); }
export async function sendEmail(email){ return request('/email/send', { method:'POST', body: JSON.stringify(email) }); }

export async function getAdminBoxes(){ return request('/admin/boxes'); }
export async function addBox(box){ return request('/admin/boxes', { method:'POST', body: JSON.stringify(box) }); }
export async function updateBox(id, box){ return request(`/admin/boxes/${id}`, { method:'PATCH', body: JSON.stringify(box) }); }
export async function deleteBox(id){ return request(`/admin/boxes/${id}`, { method:'DELETE' }); }

export function whatsapp(text){ window.open(`https://wa.me/${siteData.wa}?text=${encodeURIComponent(text)}`,'_blank'); }
export async function submitNewsletter(email){ try{ return await request('/newsletter',{method:'POST',body:JSON.stringify({email})}); }catch{return {success:true};} }
