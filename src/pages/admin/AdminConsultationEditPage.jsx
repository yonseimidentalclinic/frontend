// =================================================================
// 관리자 온라인 상담 수정 페이지 (AdminConsultationEditPage.jsx)
// 파일 경로: /src/pages/admin/AdminConsultationEditPage.jsx
// 주요 기능:
// 1. 기존 상담글 데이터를 불러와 에디터에 표시
// 2. SunEditor를 이용해 제목과 내용을 수정하고 서버에 전송
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko';

const API_URL = import.meta.env.VITE_API_URL;

const AdminConsultationEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState({ title: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchConsultation = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/consultations/${id}`);
      setConsultation(response.data);
    } catch (err) {
      setError("상담글 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const handleContentChange = (content) => {
    setConsultation(prev => ({ ...prev, content }));
  };

  const handleTitleChange = (e) => {
    setConsultation(prev => ({ ...prev, title: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consultation.title.trim() || !consultation.content.trim()) {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('accessToken');
      await axios.put(
        `${API_URL}/api/admin/consultations/${id}`,
        { title: consultation.title, content: consultation.content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('상담글이 성공적으로 수정되었습니다.');
      navigate('/admin/consultations');
    } catch (err) {
      alert('수정에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">온라인 상담글 수정</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="title" className="block text-lg font-semibold text-gray-700 mb-2">
              제목
            </label>
            <input
              type="text"
              id="title"
              value={consultation.title}
              onChange={handleTitleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              내용
            </label>
            <SunEditor
              lang={ko}
              setContents={consultation.content}
              onChange={handleContentChange}
              setOptions={{
                height: '400',
                buttonList: [
                  ['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic', 'strike'],
                  ['removeFormat'], '/', ['fontColor', 'hiliteColor'], ['align', 'list'], ['table', 'link'],
                ],
              }}
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/consultations')}
              className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold"
              disabled={isSubmitting}
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminConsultationEditPage;
