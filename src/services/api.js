// src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  // --- 핵심 수정: Content-Type 헤더를 제거하여 axios가 자동으로 설정하도록 합니다. ---
  // headers: { 'Content-Type': 'application/json' }, // 이 줄을 삭제하거나 주석 처리합니다.
  withCredentials: true,
});

// 요청(request) 인터셉터 설정
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답(response) 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');
      if (window.location.pathname !== '/admin/login') {
        window.location.href = `/admin/login?redirect=${window.location.pathname}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
