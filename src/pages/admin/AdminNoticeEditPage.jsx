import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '/src/services/api.js';
import Editor from '/src/components/Editor.jsx';

const AdminNoticeEditPage = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/notices/${id}`);
        setTitle(response.data.title);
        setContent(response.data.content);
      } catch (error) {
        console.error('공지사항 불러오기 실패:', error);
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchNotice();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    try {
      await api.put(`/notices/${id}`, { title, content });
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      console.error('공지사항 수정 실패:', error);
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">공지사항 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">제목</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
        </div>
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-700 mb-2">내용</label>
          <Editor value={content} onChange={setContent} />
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button type="button" onClick={() => navigate('/admin/notices')} className="px-6 py-2 bg-gray-500 text-white rounded-md">취소</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md">수정 완료</button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeEditPage;
