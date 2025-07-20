// src/pages/admin/AdminNoticeWritePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Editor from '../../components/Editor';
import { Upload } from 'lucide-react';

const AdminNoticeWritePage = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      await api.post('/admin/notices', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      alert('등록에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">공지사항 새 글 작성</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            카테고리 (선택)
          </label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="예: 이벤트, 점검"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지 (선택)</label>
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                  <span>파일 선택</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={(e) => setImageFile(e.target.files[0])} accept="image/*" />
                </label>
              </div>
              <p className="text-xs text-gray-500">{imageFile ? imageFile.name : 'PNG, JPG, GIF up to 5MB'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/admin/notices')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">취소</button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">등록하기</button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeWritePage;
