import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // api 모듈 경로는 실제 프로젝트에 맞게 조정하세요.
import Editor from '../../components/Editor'; // 새로 만든 에디터 컴포넌트

const AdminNoticeWritePage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await api.post('/notices', { title, content });
      alert('공지사항이 성공적으로 등록되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      console.error('공지사항 등록 실패:', error);
      alert('공지사항 등록에 실패했습니다.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">공지사항 작성</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">
            제목
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">
            내용
          </label>
          {/* 여기가 핵심! 기존 textarea를 Editor 컴포넌트로 교체 */}
          <Editor value={content} onChange={setContent} />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/notices')}
            className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeWritePage;
