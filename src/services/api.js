import axios from 'axios';

// .env.local 파일에 VITE_API_URL='http://localhost:3001' (로컬) 또는
// VITE_API_URL='https://yonsei-mi-backend.onrender.com' (배포)
// 와 같이 설정되어 있어야 합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// axios 인스턴스를 생성합니다.
// baseURL에 '/api'를 추가하여 모든 요청이 올바른 경로로 전달되도록 수정합니다.
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청(request) 인터셉터 설정
// 모든 API 요청 헤더에 JWT 토큰을 자동으로 추가합니다.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
