import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category_id: number;
  category: Category;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Slide {
  id: number;
  title: string | null;
  subtitle: string | null;
  link_url: string | null;
  image_url: string | null;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const productApi = {
  getAll: (categoryId?: number) => 
    api.get<Product[]>('/api/products', { params: { category_id: categoryId } }),
  getById: (id: number) => api.get<Product>(`/api/products/${id}`),
  create: (data: Partial<Product>) => api.post<Product>('/api/products', data),
  update: (id: number, data: Partial<Product>) => 
    api.put<Product>(`/api/products/${id}`, data),
  delete: (id: number) => api.delete(`/api/products/${id}`),
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/api/products/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const categoryApi = {
  getAll: () => api.get<Category[]>('/api/categories'),
  getById: (id: number) => api.get<Category>(`/api/categories/${id}`),
  create: (data: Partial<Category>) => api.post<Category>('/api/categories', data),
  update: (id: number, data: Partial<Category>) => 
    api.put<Category>(`/api/categories/${id}`, data),
  delete: (id: number) => api.delete(`/api/categories/${id}`),
};

export const slideApi = {
  getAll: (activeOnly: boolean = true) =>
    api.get<Slide[]>('/api/slides', { params: { active_only: activeOnly } }),
  create: (data: Partial<Slide>) => api.post<Slide>('/api/slides', data),
  update: (id: number, data: Partial<Slide>) => api.put<Slide>(`/api/slides/${id}`, data),
  delete: (id: number) => api.delete(`/api/slides/${id}`),
  uploadImage: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Slide>(`/api/slides/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post<{ access_token: string; token_type: string }>('/api/auth/login', 
      new URLSearchParams({ username, password }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    ),
  register: (username: string, email: string, password: string) =>
    api.post<User>('/api/auth/register', { username, email, password }),
  getMe: () => api.get<User>('/api/auth/me'),
};

export default api;

