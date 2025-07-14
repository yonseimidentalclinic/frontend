// =================================================================
// 프론트엔드 안정화 코드: 사용자용 온라인 상담 목록 페이지
// 파일 경로: /src/pages/ConsultationListPage.jsx
// 주요 개선사항:
// 1. 로딩, 데이터, 오류 상태를 분리하여 안정적인 UI 제공
// 2. 답변상태(답변완료/대기), 비밀글 여부 아이콘 표시
// 3. 사용자가 비밀글 클릭 시 비밀번호 확인 페이지로 이동
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const ConsultationListPage = () => {
  // 1. 상태 관리
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  // 2. 데이터 fetching 함수
  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/consultations`);
      const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setConsultations(sorted);
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
  
  // 3. 조건부 렌더링 로직
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

      {/* TODO: 페이지네이션 컴포넌트 추가 위치 */}
    </div>
  );
};

export default ConsultationListPage;
