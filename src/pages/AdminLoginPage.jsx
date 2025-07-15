// =================================================================
// 디버깅 기능이 추가된 관리자 로그인 페이지 (AdminLoginPage.jsx)
// 파일 경로: /src/pages/AdminLoginPage.jsx
// 주요 개선사항:
// 1. 로그인 시도 시 사용되는 API 주소를 콘솔에 출력
// 2. 로그인 실패 시, 서버에서 받은 에러 메시지를 더 자세하게 콘솔에 출력
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // [디버깅 코드 1] 어떤 API 서버 주소로 요청을 보내는지 확인합니다.
    console.log(`백엔드 서버에 로그인을 요청합니다: ${API_URL}/api/admin/login`);

    try {
      const response = await axios.post(`${API_URL}/api/admin/login`, { password });
      
      console.log('로그인 성공! 서버로부터 토큰을 받았습니다.');
      localStorage.setItem('accessToken', response.data.accessToken);
      navigate('/admin');

    } catch (err) {
      // [디버깅 코드 2] 로그인 실패 시, 서버로부터 받은 모든 에러 정보를 자세히 보여줍니다.
      console.error("로그인 중 심각한 오류가 발생했습니다. 아래는 서버로부터 받은 전체 에러 정보입니다.");
      console.error(err);

      if (err.response) {
        // 서버가 응답을 했지만, 상태 코드가 2xx가 아닌 경우 (예: 401 Unauthorized)
        console.error('서버 응답 데이터:', err.response.data);
        console.error('서버 응답 상태:', err.response.status);
        setError(`로그인에 실패했습니다. (상태: ${err.response.status})`);
      } else if (err.request) {
        // 요청은 이루어졌으나, 응답을 받지 못한 경우 (예: 네트워크 오류, 잘못된 API 주소)
        console.error('서버로부터 응답을 받지 못했습니다. API 주소나 네트워크 연결을 확인해주세요.');
        setError('서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.');
      } else {
        // 요청을 설정하는 중에 문제가 발생한 경우
        console.error('Axios 요청 설정 오류:', err.message);
        setError('요청 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-900">관리자 로그인</h1>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label htmlFor="password_admin" className="sr-only">비밀번호</label>
            <input
              id="password_admin"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호"
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
