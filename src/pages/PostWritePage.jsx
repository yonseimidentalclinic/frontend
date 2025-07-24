// src/pages/PostWritePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '../components/Editor';
import { Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PostWritePage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', author: '', password: '' });
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, author: user.username }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.author || !content) {
      alert('제목, 작성자, 내용을 모두 입력해주세요.');
      return;
    }
    if (!user && !formData.password) {
      alert('비회원은 비밀번호를 입력해야 합니다.');
      return;
    }

    const submissionData = new FormData();
    submissionData.append('title', formData.title);
    submissionData.append('author', formData.author);
    submissionData.append('password', formData.password);
    submissionData.append('content', content);
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    try {
      await api.post('/posts', submissionData);
      alert('게시글이 성공적으로 등록되었습니다.');
      navigate('/posts');
    } catch (error) {
      alert('게시글 등록에 실패했습니다.');
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">자유게시판 글쓰기</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">작성자</label>
          <input
            type="text"
            name="author"
            id="author"
            value={formData.author}
            onChange={handleChange}
            readOnly={!!user}
            className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${user ? 'bg-gray-100' : ''}`}
          />
        </div>
        {!user && (
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
        )}
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
          <div className="mt-1"><Editor value={content} onChange={setContent} /></div>
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">이미지 첨부 (선택)</label>
          <div className="mt-1 flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label htmlFor="image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>파일 선택</span>
                  <input id="image-upload" name="image" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                </label>
              </div>
              <p className="text-xs text-gray-500">{imageFile ? imageFile.name : 'PNG, JPG, GIF up to 5MB'}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/posts')} className="px-4 py-2 border rounded-md">취소</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">등록</button>
        </div>
      </form>
    </div>
  );
};

export default PostWritePage;
