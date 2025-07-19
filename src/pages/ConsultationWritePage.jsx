// src/pages/ConsultationWritePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '../components/Editor'; // Editor 컴포넌트 import

const ConsultationWritePage = () => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    password: '',
    isSecret: true,
  });
  const [content, setContent] = useState(''); // Editor 상태 분리
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !formData.password || !content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/consultations', { ...formData, content });
      alert('상담글이 성공적으로 등록되었습니다.');
      navigate('/consultations');
    } catch (error) {
      alert('상담글 등록에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">온라인상담 글쓰기</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">작성자</label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호</label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            name="title"
            id="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용</label>
          {/* --- 핵심 수정: textarea를 Editor 컴포넌트로 교체했습니다. --- */}
          <div className="mt-1">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex items-center">
          <input
            id="isSecret"
            name="isSecret"
            type="checkbox"
            checked={formData.isSecret}
            onChange={handleChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isSecret" className="ml-2 block text-sm text-gray-900">
            비밀글로 작성
          </label>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/consultations')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationWritePage;
