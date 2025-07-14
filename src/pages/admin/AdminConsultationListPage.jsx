// =================================================================
// 프론트엔드 안정화 코드: 관리자 온라인 상담 관리 목록 페이지
// 파일 경로: /src/pages/admin/AdminConsultationsListPage.jsx
// 주요 개선사항:
// 1. 로딩, 데이터, 오류 상태를 분리하여 안정성 강화
// 2. 답변상태(답변완료/대기), 비밀글 여부 등 복합적인 상태 표시
// 3. 관리자가 답변을 달거나 수정할 페이지로 이동하는 기능 추가
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react'; // 아이콘 사용

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const AdminConsultationsListPage = () => {
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
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  // 3. 삭제 처리 함수
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 상담글을 삭제하시겠습니까? (관련된 답변도 모두 삭제됩니다)")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/consultations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("성공적으로 삭제되었습니다.");
        fetchConsultations();
      } catch (err) {
        console.error("상담글 삭제 중 오류 발생:", err);
        alert("삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 4. 조건부 렌더링 로직
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">로딩 중...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (consultations.length === 0) {
      return <div className="text-center py-10">접수된 상담이 없습니다.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-16">번호</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-24">상태</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-24">작성자</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 w-32">작성일</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-40">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {consultations.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{item.id}</td>
                <td className="py-3 px-4">
                  {item.isAnswered ? (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">답변완료</span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">답변대기</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <Link to={`/admin/consultations/reply/${item.id}`} className="hover:underline flex items-center">
                    {item.title}
                    {item.isSecret && <Lock className="w-4 h-4 ml-2 text-gray-500" />}
                  </Link>
                </td>
                <td className="py-3 px-4">{item.author}</td>
                <td className="py-3 px-4 text-sm">{formatDate(item.createdAt)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/admin/consultations/reply/${item.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200 mr-2"
                  >
                    {item.isAnswered ? '답변수정' : '답변하기'}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">온라인 상담 관리</h1>
        <div className="bg-white rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminConsultationsListPage;
