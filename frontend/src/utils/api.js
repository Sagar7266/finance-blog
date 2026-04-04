import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fb_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fb_token');
      localStorage.removeItem('fb_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// ── Auth ──────────────────────────────────────────
export const authApi = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me: () => api.get('/auth/me'),
};

// ── Posts ─────────────────────────────────────────
export const postApi = {
  getAll: (params) => api.get('/posts', { params }),
  getFeatured: (params) => api.get('/posts/featured', { params }),
  search: (params) => api.get('/posts/search', { params }),
  getByCategory: (slug, params) => api.get(`/posts/category/${slug}`, { params }),
  getBySlug: (slug) => api.get(`/posts/${slug}`),
  getRelated: (id, categoryId) => api.get(`/posts/${id}/related`, { params: { categoryId } }),
  getAllAdmin: (params) => api.get('/posts/admin/all', { params }),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

// ── Categories ────────────────────────────────────
export const categoryApi = {
  getAll: () => api.get('/categories'),
  getBySlug: (slug) => api.get(`/categories/${slug}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// ── Comments ──────────────────────────────────────
export const commentApi = {
  getByPost: (postId) => api.get(`/posts/${postId}/comments`),
  add: (postId, data) => api.post(`/posts/${postId}/comments`, data),
  getAllAdmin: (params) => api.get('/admin/comments', { params }),
  updateStatus: (id, status) => api.patch(`/admin/comments/${id}/status`, null, { params: { status } }),
  delete: (id) => api.delete(`/admin/comments/${id}`),
};

// ── Dashboard ─────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
};
