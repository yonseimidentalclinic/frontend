// =================================================================
// 관리자 온라인 상담 목록 페이지 (AdminConsultationListPage.jsx)
// 주요 개선사항:
// 1. 각 상담글마다 '상담글 수정' 버튼을 추가
// 2. 버튼 클릭 시, 새로 만든 AdminConsultationEditPage로 이동
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR');

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/consultations`);
      if (Array.isArray(response.data)) {
        setConsultations(response.data);
      } else {
        setConsultations([]);
      }
    } catch (err) {
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

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
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-10">로딩 중...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (consultations.length === 0) return <div className="text-center py-10">접수된 상담이 없습니다.</div>;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-2 text-left">번호</th>
              <th className="py-3 px-2 text-left">상태</th>
              <th className="py-3 px-2 text-left">제목</th>
              <th className="py-3 px-2 text-left">작성자</th>
              <th className="py-3 px-2 text-left">작성일</th>
              <th className="py-3 px-2 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {consultations.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{item.id}</td>
                <td className="py-3 px-2">
                  {item.isAnswered ? '답변완료' : '답변대기'}
                </td>
                <td className="py-3 px-2">
                  <span className="flex items-center">
                    {item.title}
                    {item.isSecret && <Lock className="w-4 h-4 ml-2 text-gray-500" />}
                  </span>
                </td>
                <td className="py-3 px-2">{item.author}</td>
                <td className="py-3 px-2 text-sm">{formatDate(item.createdAt)}</td>
                <td className="py-3 px-2 text-center whitespace-nowrap">
                  <button
                    onClick={() => navigate(`/admin/consultations/reply/${item.id}`)}
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600 mr-1"
                  >
                    {item.isAnswered ? '답변수정' : '답변하기'}
                  </button>
                  {/* [핵심 추가] 상담글 수정 버튼 */}
                  <button
                    onClick={() => navigate(`/admin/consultations/edit/${item.id}`)}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600 mr-1"
                  >
                    글수정
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
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

export default AdminConsultationListPage;
