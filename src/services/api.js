import axios from 'axios';

// .env.local 파일에 VITE_API_URL='http://localhost:3001' (로컬) 또는
// VITE_API_URL='https://yonsei-mi-backend.onrender.com' (배포)
// 와 같이 설정되어 있어야 합니다.
const API_BASE_URL = import.meta.env.VITE_API_URL;

// axios 인스턴스를 생성합니다.
// baseURL에 '/api'를 추가하여 모든 요청이 올바른 경로로 전달되도록 합니다.
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORS 요청 시 쿠키 등의 인증 정보를 포함시킵니다.
});

// 요청(request) 인터셉터 설정
// 모든 API 요청 헤더에 JWT 토큰을 자동으로 추가합니다.
api.interceptors.request.use(
  (config) => {
    // *** 핵심 수정: 토큰을 가져오는 키 이름을 'accessToken'으로 변경합니다. ***
    const token = localStorage.getItem('accessToken'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 요청 오류가 있는 경우 처리
    return Promise.reject(error);
  }
);

// 응답(response) 인터셉터 설정 (선택 사항이지만 추천)
// 401 Unauthorized 오류 발생 시 자동으로 로그인 페이지로 이동시킵니다.
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('accessToken'); // 기존 토큰 삭제
      // 로그인 페이지로 리디렉션하고, 현재 페이지를 전달하여 로그인 후 돌아올 수 있도록 함
      if (window.location.pathname !== '/admin/login') {
        window.location.href = `/admin/login?redirect=${window.location.pathname}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
