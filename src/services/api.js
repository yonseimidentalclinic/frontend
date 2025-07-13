import axios from 'axios';

// 백엔드 API의 기본 URL을 환경 변수에서 가져옵니다.
// .env.local 파일에 VITE_API_URL='http://localhost:3001' (로컬) 또는
// VITE_API_URL='https://yonsei-mi-backend.onrender.com' (배포)
// 와 같이 설정되어 있어야 합니다.
const API_URL = import.meta.env.VITE_API_URL;

// axios 인스턴스를 생성합니다.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청(request) 인터셉터 설정
// 모든 API 요청 헤더에 JWT 토큰을 자동으로 추가합니다.
// 이렇게 하면 관리자 인증이 필요한 모든 요청을 간편하게 처리할 수 있습니다.
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
