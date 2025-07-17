// =================================================================
// 관리자 온라인 상담 답변 페이지 (AdminConsultationReplyPage.jsx) - 최종 완성본
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 답변 추가, 수정, 삭제 기능의 안정성 강화
// 2. 환자의 질문과 기존 답변을 명확하게 구분하여 표시
// 3. 텍스트 에디터를 사용하여 답변을 편리하게 작성하도록 UI 개선
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import ko from 'suneditor/src/lang/ko';

const API_URL = import.meta.env.VITE_API_URL;

const AdminConsultationReplyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [consultation, setConsultation] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingReply, setEditingReply] = useState(null); // { id, content }
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  const fetchConsultationDetails = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/consultations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConsultation(response.data);
    } catch (err) {
      console.error("상담 내용을 불러오는 중 오류 발생:", err);
      setError("상담 내용을 불러오는 데 실패했습니다. 목록으로 돌아가 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchConsultationDetails();
  }, [fetchConsultationDetails]);

  const handleEditClick = (reply) => {
    setEditingReply(reply);
    setReplyContent(reply.content);
    // 수정할 때 에디터가 있는 곳으로 부드럽게 스크롤
    const editorElement = document.getElementById('reply-editor-section');
    if (editorElement) {
      editorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleCancelEdit = () => {
    setEditingReply(null);
    setReplyContent('');
  };

  const handleDeleteReply = async (replyId) => {
    if (window.confirm("정말로 이 답변을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/replies/${replyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("답변이 삭제되었습니다.");
        fetchConsultationDetails(); // 목록 새로고침
        handleCancelEdit(); // 수정 중이었다면 폼 초기화
      } catch (err) {
        console.error("답변 삭제 중 오류 발생:", err);
        alert("답변 삭제에 실패했습니다.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() || replyContent === '<p><br></p>') {
      alert('답변 내용을 입력해주세요.');
      return;
    }
    setIsSubmitting(true);

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    const data = { content: replyContent };
    const action = editingReply ? '수정' : '등록';
    const url = editingReply 
      ? `${API_URL}/api/admin/replies/${editingReply.id}`
      : `${API_URL}/api/admin/consultations/${id}/replies`;
    const method = editingReply ? 'put' : 'post';

    try {
      await axios({ method, url, data, headers });
      alert(`답변이 성공적으로 ${action}되었습니다.`);
      handleCancelEdit();
      fetchConsultationDetails();
    } catch (err) {
      console.error(`답변 ${action} 중 오류 발생:`, err);
      alert(`답변 ${action}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!consultation) return null;

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">온라인 상담 답변 관리</h1>
        
        {/* 질문 내용 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">{consultation.title}</h2>
          <div className="text-sm text-gray-500 mb-4 pb-4 border-b">
            <span>작성자: {consultation.author}</span>
            <span className="mx-2">|</span>
            <span>작성일: {formatDate(consultation.createdAt)}</span>
          </div>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: consultation.content }} />
        </div>

        {/* 기존 답변 목록 */}
        {consultation.replies && consultation.replies.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">등록된 답변</h3>
            <div className="space-y-4">
              {consultation.replies.map(reply => (
                <div key={reply.id} className="bg-blue-50 p-5 rounded-lg">
                  <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: reply.content }} />
                  <div className="text-right text-sm text-gray-500 mt-4">
                    <span>{formatDate(reply.createdAt)}</span>
                    <button onClick={() => handleEditClick(reply)} className="ml-4 text-blue-600 hover:underline font-semibold">수정</button>
                    <button onClick={() => handleDeleteReply(reply.id)} className="ml-2 text-red-600 hover:underline font-semibold">삭제</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 답변 작성/수정 에디터 */}
        <div id="reply-editor-section" className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">
            {editingReply ? '답변 수정' : '새 답변 작성'}
          </h3>
          <form onSubmit={handleSubmit}>
            <SunEditor
              lang={ko}
              setContents={replyContent}
              onChange={setReplyContent}
              setOptions={{
                height: '300',
                buttonList: [
                  ['undo', 'redo'], ['font', 'fontSize', 'formatBlock'], ['bold', 'underline', 'italic', 'strike'],
                  ['removeFormat'], '/', ['fontColor', 'hiliteColor'], ['align', 'list'], ['table', 'link'],
                ],
              }}
            />
            <div className="flex justify-end gap-4 mt-6">
              {editingReply && (
                <button type="button" onClick={handleCancelEdit} className="px-6 py-2 rounded-md bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300">
                  수정 취소
                </button>
              )}
              <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? '전송 중...' : (editingReply ? '수정 완료' : '답변 등록')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminConsultationReplyPage;
