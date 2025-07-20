// src/pages/admin/AdminNoticeEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Editor from '../../components/Editor';

const AdminNoticeEditPage = () => {
  const [notice, setNotice] = useState({ title: '', category: '', content: '', imageData: null });
  const [imageFile, setImageFile] = useState(null);
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

  const handleContentChange = (value) => {
    setNotice(prevState => ({ ...prevState, content: value }));
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
    // 이미지 미리보기를 위해 기존 imageData를 null로 설정
    setNotice(prevState => ({ ...prevState, imageData: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', notice.title);
    formData.append('category', notice.category || '');
    formData.append('content', notice.content);
    
    if (imageFile) {
      formData.append('image', imageFile);
    } else {
      // 새 이미지를 올리지 않은 경우, 기존 이미지 정보를 보냅니다.
      formData.append('existingImageData', notice.imageData || '');
    }

    try {
      await api.put(`/admin/notices/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      alert('수정에 실패했습니다.');
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            내용
          </label>
          <Editor value={notice.content} onChange={handleContentChange} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
          <input 
            type="file" 
            onChange={handleImageChange} 
            accept="image/*" 
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          {notice.imageData && !imageFile && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">현재 이미지:</p>
              <img src={notice.imageData} alt="Current" className="max-h-48 rounded-md border" />
            </div>
          )}
        </div>
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/admin/notices')} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">취소</button>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">수정 완료</button>
        </div>
      </form>
    </div>
  );
};
export default AdminNoticeEditPage;
