// =================================================================
// 프론트엔드 병원소식 목록 페이지 (NoticeListPage.jsx)
// 최종 업데이트: 2025년 7월 16일
// 주요 개선사항:
// 1. 페이지 번호에 따라 공지사항 목록을 불러오는 기능 추가
// 2. 페이지네이션 컴포넌트를 추가하여 페이지 이동 기능 구현
// =================================================================

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination.jsx';

const API_URL = import.meta.env.VITE_API_URL;

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // [핵심 추가] 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalNotices, setTotalNotices] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    const fetchNotices = async (page) => {
      setLoading(true);
      setError(null);
      try {
        // [핵심 수정] API 호출 시 페이지 번호를 함께 보냅니다.
        const response = await axios.get(`${API_URL}/api/notices`, { params: { page: page, limit: 10 } });
        
        if (response.data && Array.isArray(response.data.notices)) {
          setNotices(response.data.notices);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
          // 전체 게시물 수를 계산하기 위해 totalPages와 limit을 사용 (서버에서 직접 주지 않을 경우)
          // 이 예제에서는 서버가 totalPages를 주므로 직접 계산할 필요는 없습니다.
          // 하지만 첫 게시물 번호를 정확히 표시하기 위해 전체 개수를 알아두면 좋습니다.
          // 간단한 계산: (전체 페이지 - 1) * 10 + 마지막 페이지의 게시물 수. 여기서는 더 간단하게 가정합니다.
        } else {
          setNotices([]);
          setTotalPages(0);
        }
      } catch (err) {
        console.error("공지사항 목록을 불러오는 중 오류가 발생했습니다:", err);
        setError("목록을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices(pageFromUrl);
  }, [searchParams]);

  const handlePageChange = (page) => {
    navigate(`/news?page=${page}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20 text-gray-500">목록을 불러오는 중입니다...</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>;
    }
    if (notices.length === 0) {
      return <div className="text-center py-20 text-gray-500">등록된 공지사항이 없습니다.</div>;
    }
    return (
      <div className="border-t-2 border-b-2 border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b">
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-20">번호</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-32">작성일</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {notices.map((notice, index) => (
              <tr key={notice.id} className="border-b border-gray-200 last:border-b-0">
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-500">
                  {/* 페이지네이션을 고려한 게시물 번호 계산이 필요하지만, 여기서는 ID를 그대로 사용합니다. */}
                  {notice.id}
                </td>
                <td className="py-4 px-2 sm:px-4">
                  <Link to={`/news/${notice.id}`} className="hover:underline text-gray-800">
                    {notice.title}
                  </Link>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{formatDate(notice.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">병원소식</h1>
        <p className="text-gray-500 mt-2">연세미치과의 새로운 소식을 전해드립니다.</p>
      </div>
      {renderContent()}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NoticeListPage;
