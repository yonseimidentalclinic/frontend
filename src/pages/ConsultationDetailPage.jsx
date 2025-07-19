// src/pages/ConsultationDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, MessageSquare } from 'lucide-react';

const ConsultationDetailPage = () => {
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchConsultation = async () => {
      setLoading(true);
      setError(null);
      try {
        // 비밀글 확인 로직은 이 페이지 진입 전에 처리되었다고 가정합니다.
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

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!consultation) return <div className="text-center py-20">상담글을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* 질문 */}
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
          <div className="p-8 text-slate-700 leading-relaxed whitespace-pre-wrap">
            {consultation.content}
          </div>
        </div>

        {/* 답변 */}
        {consultation.replies && consultation.replies.length > 0 && (
          <div className="mt-8 bg-indigo-50 shadow-xl rounded-lg overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-indigo-800 flex items-center mb-4">
                <MessageSquare className="mr-3 h-7 w-7" />
                연세미치과 답변
              </h2>
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {consultation.replies[0].content}
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          {/* --- 핵심 수정: 목록으로 돌아가는 링크 주소를 올바르게 수정했습니다. --- */}
          <Link 
            to="/consultations" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetailPage;
