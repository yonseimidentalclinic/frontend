// src/pages/ConsultationDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ConsultationDetailPage = () => {
  const { user } = useAuth();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultation = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/consultations/${id}`);
        setConsultation(response.data);
      } catch (err) {
        setError('상담글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id]);

  const handleEdit = async () => {
    if (user && user.id === consultation.userId) {
      navigate(`/consultations/edit/${id}`);
      return;
    }
    
    const password = window.prompt('상담글을 수정하려면 비밀번호를 입력하세요.');
    if (password === null) return;
    if (!password) {
      alert('비밀번호를 입력해야 합니다.');
      return;
    }

    try {
      const response = await api.post(`/consultations/${id}/verify`, { password });
      if (response.data.success) {
        navigate(`/consultations/edit/${id}`);
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      alert('확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  const handleDelete = async () => {
    const isOwner = user && user.id === consultation.userId;
    const confirmationMessage = '정말로 이 상담글을 삭제하시겠습니까?';

    if (isOwner) {
      if (window.confirm(confirmationMessage)) {
        try {
          await api.delete(`/consultations/${id}`);
          alert('상담글이 삭제되었습니다.');
          navigate('/consultations');
        } catch (err) { alert('삭제에 실패했습니다.'); }
      }
      return;
    }

    const password = window.prompt('상담글을 삭제하려면 비밀번호를 입력하세요.');
    if (password === null) return;
    if (!password) {
      alert('비밀번호를 입력해야 합니다.');
      return;
    }

    try {
      await api.delete(`/consultations/${id}`, { data: { password } });
      alert('상담글이 성공적으로 삭제되었습니다.');
      navigate('/consultations');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('비밀번호가 올바르지 않습니다.');
      } else {
        alert('상담글 삭제에 실패했습니다.');
      }
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!consultation) return <div className="text-center py-20">상담글을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-slate-800">{consultation.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-slate-500">작성자: {consultation.author}</p>
              <p className="text-sm text-slate-500">
                작성일: {new Date(consultation.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          {consultation.imageData && (
            <div className="p-8 border-b">
              <img src={consultation.imageData} alt="첨부 이미지" className="max-w-full h-auto rounded-lg mx-auto" />
            </div>
          )}
          <div
            className="p-8 prose max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: consultation.content }}
          />
        </div>
        {consultation.replies && consultation.replies.length > 0 && (
          <div className="mt-8 bg-indigo-50 shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-indigo-800 flex items-center mb-4">
                <MessageSquare className="mr-3 h-7 w-7" />
                연세미치과 답변
              </h2>
              <div
                className="prose max-w-none text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: consultation.replies[0].content }}
              />
            </div>
          </div>
        )}
        <div className="mt-8 flex justify-between items-center">
          <Link 
            to="/consultations" 
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            목록으로
          </Link>
          <div className="flex space-x-4">
            <button 
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg"
            >
              <Edit className="mr-2 h-4 w-4" /> 수정
            </button>
            <button 
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg"
            >
              <Trash2 className="mr-2 h-4 w-4" /> 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;
