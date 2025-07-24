// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showHelp, setShowHelp] = useState(false); // 비밀번호 찾기 안내 표시 상태
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(formData.email, formData.password);
      navigate('/mypage'); // 로그인 성공 시 마이페이지로 이동
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
          <input type="email" name="email" id="email" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input type="password" name="password" id="password" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">로그인</button>
        
        <div className="text-center text-sm">
          <p className="text-gray-600">
            아직 회원이 아니신가요? <Link to="/register" className="font-medium text-indigo-600 hover:underline">회원가입</Link>
          </p>
          {/* --- 핵심 추가: 비밀번호 찾기 링크 --- */}
          <button 
            type="button" 
            onClick={() => setShowHelp(true)} 
            className="mt-2 font-medium text-sm text-gray-500 hover:text-indigo-600 hover:underline"
          >
            비밀번호를 잊으셨나요?
          </button>
        </div>

        {/* --- 핵심 추가: 비밀번호 찾기 안내 메시지 --- */}
        {showHelp && (
          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700">
            <h4 className="font-bold">비밀번호 초기화 안내</h4>
            <p className="text-sm mt-1">
              보안을 위해 비밀번호 찾기는 전화 또는 온라인 상담을 통해 본인 확인 후 처리해 드리고 있습니다. <br/>
              병원으로 연락 부탁드립니다. (031-905-7285)
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
