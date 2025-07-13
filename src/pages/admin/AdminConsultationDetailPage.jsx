import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';
import Editor from '/src/components/Editor.jsx';
import LoadingSpinner from '/src/components/LoadingSpinner.jsx';

const AdminConsultationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [consultation, setConsultation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchConsultation = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/consultations/${id}`);
      const data = response.data;
      setConsultation(data);
      if (data.reply_content) {
        setReplyContent(data.reply_content);
      }
    } catch (error) {
      console.error('상담 내용 로딩 실패:', error);
      alert('상담 내용을 불러오는 데 실패했습니다.');
      navigate('/admin/consultations');
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    try {
      if (consultation.reply_id) {
        await api.put(`/consultations/replies/${consultation.reply_id}`, { content: replyContent });
        alert('답변이 성공적으로 수정되었습니다.');
      } else {
        await api.post(`/consultations/${id}/reply`, { content: replyContent });
        alert('답변이 성공적으로 등록되었습니다.');
      }
      fetchConsultation();
    } catch (error) {
      console.error('답변 처리 실패:', error);
      alert('답변 처리에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!consultation) {
    return <div className="p-8">상담 내용을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">온라인 상담 상세</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-2">{consultation.title}</h2>
        <div className="text-sm text-gray-500 mb-4">
          <span>작성자: {consultation.author}</span> | <span>작성일: {new Date(consultation.created_at).toLocaleString()}</span>
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: consultation.content }} />
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">답변 작성 및 수정</h3>
        <form onSubmit={handleSubmitReply}>
          <Editor value={replyContent} onChange={setReplyContent} />
          <div className="flex justify-end space-x-4 mt-8">
            <button type="button" onClick={() => navigate('/admin/consultations')} className="px-6 py-2 bg-gray-500 text-white rounded-md">목록으로</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-md">
              {consultation.reply_id ? '답변 수정' : '답변 등록'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminConsultationDetailPage;