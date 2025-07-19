// src/pages/admin/AdminAboutPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Editor from '../../components/Editor'; // Editor 컴포넌트 import

const AdminAboutPage = () => {
  const [about, setAbout] = useState({ title: '', subtitle: '', content: '', imageData: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAbout = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/about');
      setAbout(response.data);
    } catch (err) {
      setError('병원소개 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAbout(prevState => ({ ...prevState, [name]: value }));
  };
  
  // Editor의 내용이 변경될 때 호출될 함수
  const handleContentChange = (value) => {
    setAbout(prevState => ({ ...prevState, content: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAbout(prevState => ({ ...prevState, imageData: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/about', about);
      alert('병원소개 정보가 성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">병원소개 관리</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input type="text" name="title" id="title" value={about.title || ''} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
          <input type="text" name="subtitle" id="subtitle" value={about.subtitle || ''} onChange={handleChange} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
          <input type="file" onChange={handleImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          {about.imageData && <img src={about.imageData} alt="Preview" className="mt-4 max-h-48 rounded-md" />}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 내용</label>
          {/* --- 핵심 수정: textarea를 Editor 컴포넌트로 교체했습니다. --- */}
          <Editor value={about.content || ''} onChange={handleContentChange} />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors">
            저장하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAboutPage;
