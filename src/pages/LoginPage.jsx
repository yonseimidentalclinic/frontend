// src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
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
          <label>이메일</label>
          <input type="email" name="email" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg">로그인</button>
        <p className="text-center text-sm">
          아직 회원이 아니신가요? <Link to="/register" className="text-indigo-600 hover:underline">회원가입</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
