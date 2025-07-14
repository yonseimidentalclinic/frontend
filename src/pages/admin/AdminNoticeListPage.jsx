// =================================================================
// 프론트엔드 안정화 코드: 관리자 공지사항 목록 페이지
// 파일 경로: /src/pages/admin/AdminNoticesListPage.jsx
// 주요 개선사항:
// 1. 로딩, 데이터, 오류 상태를 분리하여 관리
// 2. 데이터 로딩 중에는 로딩 표시, 실패 시에는 오류 메시지 표시
// 3. 데이터가 비어있을 경우 "작성된 공지사항이 없습니다" 메시지 표시
// 4. 삭제 기능 후 목록 자동 새로고침
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const AdminNoticesListPage = () => {
  // 1. 상태 관리: 데이터(notices), 로딩(loading), 오류(error)
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  // 2. 데이터 fetching 함수 (useCallback으로 불필요한 재생성 방지)
  const fetchNotices = useCallback(async () => {
    setLoading(true); // 데이터 요청 시작 시 로딩 상태로 변경
    setError(null); // 이전 오류 상태 초기화
    try {
      const response = await axios.get(`${API_URL}/api/notices`);
      // 백엔드에서 받아온 createdAt을 기준으로 내림차순 정렬 (이미 백엔드에서 정렬했지만, 한번 더 확인)
      const sortedNotices = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotices(sortedNotices);
    } catch (err) {
      console.error("공지사항 목록을 불러오는 중 오류가 발생했습니다:", err);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false); // 요청 완료 후 로딩 상태 해제
    }
  }, []);

  // 컴포넌트 마운트 시 데이터 fetching 실행
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // 3. 삭제 처리 함수
  const handleDelete = async (id) => {
    // 실제 운영에서는 alert/confirm 대신 UI 라이브러리의 모달창 사용을 권장합니다.
    if (window.confirm("정말로 이 공지사항을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/notices/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("성공적으로 삭제되었습니다.");
        // 삭제 성공 후 목록을 다시 불러와 UI를 업데이트합니다.
        fetchNotices();
      } catch (err) {
        console.error("공지사항 삭제 중 오류 발생:", err);
        alert("삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 4. 조건부 렌더링 로직
  const renderContent = () => {
    // 로딩 중일 때
    if (loading) {
      return <div className="text-center py-10">로딩 중...</div>;
    }
    // 오류 발생 시
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    // 데이터가 없을 때 (로딩 완료 후)
    if (notices.length === 0) {
      return <div className="text-center py-10">작성된 공지사항이 없습니다.</div>;
    }
    // 데이터가 성공적으로 로드되었을 때
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

export default AdminNoticesListPage;
