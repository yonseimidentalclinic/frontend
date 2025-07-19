// src/pages/admin/AdminConsultationReplyPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import Editor from '../../components/Editor'; // Editor 컴포넌트 import

const AdminConsultationReplyPage = () => {
  const [consultation, setConsultation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        // 답변 페이지이므로, 관리자용 상세 API를 호출하는 것이 더 적합할 수 있습니다.
        // 여기서는 기존 public API를 사용합니다.
        const response = await api.get(`/consultations/${id}`);
        setConsultation(response.data);
        // 기존 답변이 있으면 불러오기
        if (response.data.replies && response.data.replies.length > 0) {
          setReplyContent(response.data.replies[0].content);
        }
      } catch (error) {
        alert('상담글 정보를 불러오는 데 실패했습니다.');
        navigate('/admin/consultations');
      }
    };
    fetchConsultation();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    try {
      // 기존 답변이 있는지 여부에 따라 POST 또는 PUT 요청
      if (consultation.replies && consultation.replies.length > 0) {
        await api.put(`/admin/replies/${consultation.replies[0].id}`, { content: replyContent });
      } else {
        await api.post(`/admin/consultations/${id}/replies`, { content: replyContent });
      }
      alert('답변이 성공적으로 등록/수정되었습니다.');
      navigate('/admin/consultations');
    } catch (error) {
      alert('답변 처리 중 오류가 발생했습니다.');
      console.error(error);
    }
  };

  if (!consultation) {
    return <div className="p-8 text-center">로딩 중...</div>;
  }

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">온라인상담 답변 관리</h1>
      <div className="bg-white p-8 shadow-md rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-gray-800">{consultation.title}</h2>
        <p className="text-sm text-gray-500 mt-1">작성자: {consultation.author}</p>
        <div className="mt-4 p-4 bg-gray-50 rounded border" dangerouslySetInnerHTML={{ __html: consultation.content }} />
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            답변 내용
          </label>
          {/* --- 핵심 수정: textarea를 Editor 컴포넌트로 교체했습니다. --- */}
          <Editor value={replyContent} onChange={setReplyContent} />
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/consultations')}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            목록으로
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            답변 등록/수정
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminConsultationReplyPage;
