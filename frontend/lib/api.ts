import axios, { InternalAxiosRequestConfig } from 'axios';
import type { RegisterData, ReminderData, LoginRequestData } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const axiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the access token
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE}/api/refresh`, { refresh_token: refreshToken });
          const { access_token, refresh_token: new_refresh } = res.data;

          localStorage.setItem('access_token', access_token);
          localStorage.setItem('refresh_token', new_refresh);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axiosInstance(originalRequest);
        } catch {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          if (typeof window !== 'undefined') window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (data: LoginRequestData) => axiosInstance.post('/api/auth/login', data),
  register: (data: RegisterData) => axiosInstance.post('/api/auth/register', data),
  logout: () => axiosInstance.post('/api/auth/logout'),
  getCurrentUser: () => axiosInstance.get('/api/auth/me'),
};

export const medicalApi = {
  analyzeSymptoms: (query: string) => axiosInstance.post('/api/analyze-symptoms', { query }),
  uploadPrescription: (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return axiosInstance.post('/api/upload-prescription', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getMedicine: (name: string) => axiosInstance.get(`/api/medicines/${encodeURIComponent(name)}`),
  getReminders: () => axiosInstance.get('/api/reminders'),
  addReminder: (data: ReminderData) => axiosInstance.post('/api/reminders', data),
  deleteReminder: (id: number) => axiosInstance.delete(`/api/reminders/${id}`),
  getHistory: (page = 1, limit = 10) => axiosInstance.get(`/api/history?page=${page}&limit=${limit}`),
};

// Named `api` object for pages that import { api } from '@/lib/api'
// Methods return unwrapped response data directly.
export const api = {
  getMedicine: async (name: string) => {
    const res = await axiosInstance.get(`/api/medicines/${encodeURIComponent(name)}`);
    return res.data;
  },
  getReminders: async () => {
    const res = await axiosInstance.get('/api/reminders');
    return res.data;
  },
  addReminder: async (data: ReminderData) => {
    const res = await axiosInstance.post('/api/reminders', data);
    return res.data;
  },
  deleteReminder: async (id: number) => {
    await axiosInstance.delete(`/api/reminders/${id}`);
  },
  uploadPrescription: async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    const res = await axiosInstance.post('/api/upload-prescription', fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};

export default axiosInstance;
