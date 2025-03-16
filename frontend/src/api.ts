// src/api.ts

import axios, { AxiosError } from "axios";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants";

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// Create a separate instance for refresh token requests
const refreshApi = axios.create({
  baseURL: BASE_URL,
});

const api = axios.create({
  baseURL: BASE_URL,
});

// Create a flag to prevent multiple refresh requests
let isRefreshing = false;

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let failedQueue: QueueItem[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    console.log('Response error:', error.response?.status, originalRequest.url);

    // Prevent infinite loops and duplicate refresh attempts
    if (error.response?.status !== 401 || 
        originalRequest._retry || 
        originalRequest.url?.includes('token/refresh')) {
      return Promise.reject(error);
    }

    console.log('Attempting token refresh...');

    // If already refreshing, queue the request
    if (isRefreshing) {
      console.log('Already refreshing, queueing request...');
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch(err => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    if (!refreshToken) {
      console.log('No refresh token found');
      processQueue(new Error('No refresh token'));
      return Promise.reject(error);
    }

    try {
      console.log('Making refresh token request...');
      const response = await refreshApi.post('/api/token/refresh/', {
        refresh: refreshToken
      });

      console.log('Refresh successful');
      const { access } = response.data;
      localStorage.setItem(ACCESS_TOKEN, access);
      
      // Update authorization header
      originalRequest.headers.Authorization = `Bearer ${access}`;
      processQueue(null, access);
      
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Refresh failed:', refreshError);
      processQueue(refreshError);
      // Clear tokens and redirect to login
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = '/login';
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;