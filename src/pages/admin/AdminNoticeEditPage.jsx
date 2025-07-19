// src/pages/admin/AdminNoticeEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Editor from '../../components/Editor'; 
const AdminNoticeEditPage = () => {
  const [notice, setNotice] = useState({ title: '', category: '', content: '' });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const response = await api.get(`/admin/notices/${id}`);
        setNotice(response.data);
      } catch (error) {
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
        navigate('/admin/notices');
      }
    };
    fetchNotice();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNotice(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/notices/${id}`, notice);
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      alert('공지사항 수정에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">공지사항 수정</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={notice.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            카테고리 (선택)
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={notice.category || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <textarea
            id="content"
            name="content"
            rows="15"
            value={notice.content}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          ></textarea>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/notices')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminNoticeEditPage;
