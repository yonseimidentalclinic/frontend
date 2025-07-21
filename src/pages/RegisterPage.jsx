// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/auth/register', formData);
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">회원가입</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label>이름</label>
          <input type="text" name="username" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        <div>
          <label>이메일</label>
          <input type="email" name="email" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        <div>
          <label>비밀번호</label>
          <input type="password" name="password" onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg">가입하기</button>
        <p className="text-center text-sm">
          이미 회원이신가요? <Link to="/login" className="text-indigo-600 hover:underline">로그인</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
