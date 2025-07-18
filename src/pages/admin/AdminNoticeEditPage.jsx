// =================================================================
// 관리자 공지사항 수정 페이지 (AdminNoticeEditPage.jsx)
// 최종 업데이트: 2025년 7월 18일
// 주요 개선사항:
// 1. 기존 글의 카테고리를 불러와 표시하고, 수정할 수 있도록 기능 추가
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko';

const API_URL = import.meta.env.VITE_API_URL;
const NOTICE_CATEGORIES = ['병원소식', '의료상식', '이벤트'];

const AdminNoticeEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(NOTICE_CATEGORIES[0]); // [핵심 추가]
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotice = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/notices/${id}`);
      setTitle(response.data.title);
      setContent(response.data.content);
      setCategory(response.data.category || NOTICE_CATEGORIES[0]); // [핵심 수정]
    } catch (err) {
      alert('공지사항 정보를 불러오지 못했습니다.');
      navigate('/admin/notices');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchNotice();
  }, [fetchNotice]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_URL}/api/admin/notices/${id}`,
        { title, content, category }, // [핵심 수정]
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices');
    } catch (err) {
      alert('수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">공지사항 수정</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">제목</label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 border rounded-md" required />
            </div>
            <div>
              <label htmlFor="category" className="block text-lg font-semibold text-gray-700 mb-2">카테고리</label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2 border rounded-md bg-white">
                {NOTICE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">내용</label>
            <SunEditor
              lang={ko}
              setContents={content}
              onChange={setContent}
              setOptions={{ height: '400', buttonList: [['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic', 'strike'], ['removeFormat'], '/', ['fontColor', 'hiliteColor'], ['align', 'list'], ['table', 'link']] }}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/notices')} className="px-6 py-2 rounded-md bg-gray-200" disabled={isSubmitting}>취소</button>
            <button type="submit" className="px-6 py-2 rounded-md bg-blue-600 text-white" disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminNoticeEditPage;
