// =================================================================
// 관리자 병원소개 관리 페이지 (AdminAboutPage.jsx)
// 파일 경로: /src/pages/admin/AdminAboutPage.jsx
// 주요 기능:
// 1. 병원소개 페이지의 제목, 부제목, 본문, 대표 이미지를 관리
// 2. 이미지 리사이징 기능을 포함하여 안정적인 파일 업로드 지원
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Save, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const AdminAboutPage = () => {
  const [content, setContent] = useState({ title: '', subtitle: '', content: '', imageData: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchAboutContent = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/about`);
      if (response.data) {
        setContent(response.data);
      }
    } catch (err) {
      setError('콘텐츠를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAboutContent();
  }, [fetchAboutContent]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContent(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1200,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        setContent(prev => ({ ...prev, imageData: reader.result }));
      };
    } catch (error) {
      alert('이미지 압축에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/api/admin/about`, content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">병원소개 페이지 관리</h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">페이지 제목</label>
            <input id="title" name="title" type="text" value={content.title || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="subtitle" className="block text-lg font-semibold text-gray-700 mb-2">부제목</label>
            <input id="subtitle" name="subtitle" type="text" value={content.subtitle || ''} onChange={handleInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">본문 내용</label>
            <textarea id="content" name="content" value={content.content || ''} onChange={handleInputChange} rows="6" className="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">대표 이미지</label>
            <div className="flex items-center gap-4">
              <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                사진 교체
              </label>
              <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {content.imageData && <img src={content.imageData} alt="미리보기" className="w-32 h-32 object-cover rounded-md border" />}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center disabled:bg-blue-300">
              <Save className="mr-2 w-5 h-5" />
              {isSaving ? '저장 중...' : '변경사항 저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminAboutPage;
