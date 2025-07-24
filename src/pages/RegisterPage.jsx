// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sm:mx-auto sm:w-full sm:max-w-md"
      >
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          회원가입
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            로그인
          </Link>
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mt-8 sm:mx-auto sm:w-full sm:max-w-md"
      >
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">이름</label>
              <input id="username" name="username" type="text" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 주소</label>
              <input id="email" name="email" type="email" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
              <input id="password" name="password" type="password" required onChange={handleChange} className="mt-1 appearance-none block w-full px-3 py-2 border rounded-md shadow-sm"/>
            </div>
            
            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                가입하기
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
