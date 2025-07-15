// =================================================================
// 프론트엔드 온라인 상담 목록 페이지 (ConsultationListPage.jsx)
// 최종 업데이트: 2025년 7월 15일
// 주요 개선사항:
// 1. 서버에서 비정상적인 데이터가 와도 앱이 멈추지 않도록 안정성 강화
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/consultations`);
      // [핵심 수정] 서버에서 받은 데이터가 배열(목록) 형태일 때만 상태를 업데이트합니다.
      if (Array.isArray(response.data)) {
        setConsultations(response.data);
      } else {
        console.error("API did not return an array for consultations:", response.data);
        setConsultations([]);
      }
    } catch (err) {
      console.error("상담 목록을 불러오는 중 오류가 발생했습니다:", err);
      setError("상담 목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);
  
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20 text-gray-500">상담 목록을 불러오는 중입니다...</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>;
    }
    if (consultations.length === 0) {
      return <div className="text-center py-20 text-gray-500">접수된 상담이 없습니다.</div>;
    }
    return (
      <div className="border-t-2 border-b-2 border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="hidden md:table-header-group">
            <tr className="border-b">
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-20">번호</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-24">답변상태</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-28">작성자</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-32">작성일</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {consultations.map((item, index) => {
              const linkTo = item.isSecret 
                ? `/consultation/${item.id}/verify` 
                : `/consultation/${item.id}`;

              return (
                <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-500">{consultations.length - index}</td>
                  <td className="py-4 px-2 sm:px-4 text-center">
                    {item.isAnswered ? (
                      <span className="text-blue-600 font-semibold text-sm">답변완료</span>
                    ) : (
                      <span className="text-gray-500 text-sm">답변대기</span>
                    )}
                  </td>
                  <td className="py-4 px-2 sm:px-4">
                    <Link to={linkTo} className="hover:underline flex items-center">
                      {item.title}
                      {item.isSecret && <Lock className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" />}
                    </Link>
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{item.author}</td>
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">온라인 상담</h1>
        <p className="text-gray-500 mt-2">궁금한 점을 문의하시면 친절하게 답변해 드립니다.</p>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Link 
          to="/consultation/write"
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          상담하기
        </Link>
      </div>

      {renderContent()}
    </div>
  );
};

export default ConsultationListPage;
