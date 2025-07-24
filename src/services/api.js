// src/services/api.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// --- 요청 인터셉터: 모든 요청에 자동으로 토큰을 추가합니다. ---
api.interceptors.request.use(
  (config) => {
    // 관리자 토큰과 사용자 토큰을 모두 확인합니다.
    const adminToken = localStorage.getItem('accessToken');
    const userToken = localStorage.getItem('userToken');
    
    // 현재 접속한 페이지 주소를 확인하여 적절한 토큰을 사용합니다.
    if (window.location.pathname.startsWith('/admin') && adminToken) {
      config.headers['Authorization'] = `Bearer ${adminToken}`;
    } else if (userToken) {
      // 이 부분은 환자용 '마이페이지' 등에서 사용됩니다.
      config.headers['Authorization'] = `Bearer ${userToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- 응답 인터셉터: 토큰 만료 등 인증 오류 발생 시 자동으로 로그아웃 처리 ---
api.interceptors.response.use(
  (response) => {
    // 요청이 성공하면 그대로 반환합니다.
    return response;
  },
  (error) => {
    // 401(인증 안됨) 또는 403(권한 없음/만료됨) 오류가 발생했을 때
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      
      // 관리자 페이지에서 발생한 오류인 경우
      if (window.location.pathname.startsWith('/admin')) {
        // 만료된 관리자 토큰을 삭제합니다.
        localStorage.removeItem('accessToken');
        
        // 현재 페이지가 로그인 페이지가 아닐 때만 알림을 띄우고 이동합니다.
        if (window.location.pathname !== '/admin/login') {
          alert('세션이 만료되었습니다. 보안을 위해 다시 로그인해주세요.');
          window.location.href = '/admin/login';
        }
      } 
      // (추후 환자용 마이페이지 등에서 오류 발생 시 처리 로직 추가 가능)
    }
    
    // 다른 종류의 오류는 그대로 반환하여 각 페이지에서 처리하도록 합니다.
    return Promise.reject(error);
  }
);

export default api;
