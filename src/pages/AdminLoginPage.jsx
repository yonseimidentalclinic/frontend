import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function AdminLoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/login`;
      const response = await axios.post(apiUrl, { password });

      if (response.data.success) {
        // 1. 로그인이 성공하면, 백엔드가 보내준 '인증 토큰'을 저장합니다.
        // localStorage는 브라우저에 데이터를 저장하는 작은 창고입니다.
        localStorage.setItem('adminToken', response.data.token);
        
        // 2. 관리자 페이지의 메인 화면으로 이동시킵니다.
        navigate('/admin/dashboard'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Helmet>
        <title>관리자 로그인 | 연세미치과</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-900">
            관리자 로그인
          </h1>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label htmlFor="password" className="sr-only">비밀번호</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="비밀번호를 입력하세요"
              />
            </div>

            {error && (
              <p className="text-center text-sm text-red-600">
                {error}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                로그인
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;
