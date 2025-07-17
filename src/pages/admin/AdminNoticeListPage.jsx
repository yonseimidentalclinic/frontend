// =================================================================
// 관리자 공지사항 목록 페이지 (AdminNoticeListPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 페이지네이션이 적용된 API 응답 형식({ items: [...] })에 맞게 데이터 처리 로직 수정
// 2. 관리자 페이지에서는 모든 목록을 볼 수 있도록 API 호출 방식 변경
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 관리자 페이지에서는 페이지네이션 없이 모든 목록을 가져옵니다.
      const response = await axios.get(`${API_URL}/api/notices`, { params: { limit: 9999 } });
      
      // [핵심 수정] 서버 응답이 { items: [...] } 형태의 객체이므로, response.data.items를 사용합니다.
      if (response.data && Array.isArray(response.data.items)) {
        setNotices(response.data.items);
      } else {
        console.error("API did not return expected format for admin notices:", response.data);
        setNotices([]);
      }
    } catch (err) {
      console.error("공지사항 목록을 불러오는 중 오류가 발생했습니다:", err);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/notices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("성공적으로 삭제되었습니다.");
        fetchNotices();
      } catch (err) {
        alert("삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">로딩 중...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (notices.length === 0) {
      return <div className="text-center py-10">작성된 공지사항이 없습니다.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">작성일</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {notices.map((notice) => (
              <tr key={notice.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{notice.id}</td>
                <td className="py-3 px-4">
                  <Link to={`/admin/notices/edit/${notice.id}`} className="hover:underline">
                    {notice.title}
                  </Link>
                </td>
                <td className="py-3 px-4 text-sm">{formatDate(notice.createdAt)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-200 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(notice.id)}
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">공지사항 관리</h1>
          <Link
            to="/admin/notices/write"
            className="bg-green-500 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors duration-200"
          >
            새 글 작성
          </Link>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeListPage;
