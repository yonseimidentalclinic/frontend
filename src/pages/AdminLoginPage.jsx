import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';

const AdminLoginPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // 이전 오류 메시지 초기화

    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      const response = await api.post('/admin/login', { password });

      // 서버로부터 accessToken을 성공적으로 받았는지 확인
      if (response.data && response.data.accessToken) {
        // 토큰을 localStorage에 저장
        localStorage.setItem('adminToken', response.data.accessToken);
        
        // 저장 후 관리자 대시보드로 이동
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('로그인에 실패했습니다. 서버로부터 올바른 응답을 받지 못했습니다.');
      }
    } catch (err) {
      console.error('Login failed:', err);
      if (err.response && err.response.status === 401) {
        setError('비밀번호가 일치하지 않습니다.');
      } else {
        setError('로그인 중 오류가 발생했습니다. 서버 연결 상태를 확인해주세요.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">관리자 로그인</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-center text-red-600">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              로그인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
