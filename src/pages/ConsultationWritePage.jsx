import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/src/services/api.js'; // 경로 수정
import Editor from '/src/components/Editor.jsx'; // 경로 수정

const ConsultationWritePage = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSecret, setIsSecret] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !author.trim() || !password.trim() || !content.trim()) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      await api.post('/consultations', { title, author, password, content, isSecret });
      alert('상담글이 성공적으로 등록되었습니다. 관리자 답변 후 목록에서 확인하실 수 있습니다.');
      navigate('/consultations');
    } catch (error) {
      console.error('상담글 등록 실패:', error);
      alert('상담글 등록에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">온라인 상담 작성</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">작성자</label>
            <input
              type="text"
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="이름"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="상담글 확인 시 필요"
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">상담 내용</label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div className="mb-6">
          <div className="flex items-center">
            <input
              id="isSecret"
              name="isSecret"
              type="checkbox"
              checked={isSecret}
              onChange={(e) => setIsSecret(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isSecret" className="ml-2 block text-sm text-gray-900">
              비밀글로 작성하기 (관리자만 볼 수 있습니다)
            </label>
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/consultations')}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            상담 신청하기
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationWritePage;
