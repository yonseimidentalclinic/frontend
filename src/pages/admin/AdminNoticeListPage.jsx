// src/pages/admin/AdminNoticeListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// *** 오류 수정: 기존 api 인스턴스 대신 axios를 직접 사용합니다. ***
// 이는 '/api' 경로 문제에 대한 임시 해결책입니다.
// 근본적인 해결을 위해서는 백엔드 라우팅 또는 프론트엔드의 api.js 설정을 확인해야 합니다.
import axios from 'axios'; 
import Pagination from '../../components/Pagination'; 
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminNoticeListPage = () => {
  // --- 상태 관리 (State Management) --- //
  const [notices, setNotices] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalNotices, setTotalNotices] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  // --- React Router Hooks --- //
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- 데이터 로딩 함수 (API 경로 수정) --- //
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const page = searchParams.get('page') || '1';
      const query = searchParams.get('query') || '';

      // *** 오류 수정: 404 오류 해결을 위해 API 요청 주소를 직접 구성합니다. ***
      // VITE_API_URL 환경변수를 사용하여 '/api' 접두사 없이 요청을 보냅니다.
      const API_BASE_URL = import.meta.env.VITE_API_URL;
      const response = await axios.get(`${API_BASE_URL}/admin/notices`, {
        params: { page, query },
        withCredentials: true // 인증 쿠키를 포함하기 위해 필요할 수 있습니다.
      });
      
      setNotices(response.data.notices);
      setTotalPages(response.data.totalPages);
      setTotalNotices(response.data.totalCount);
      setCurrentPage(parseInt(page, 10));
      setSearchTerm(query);

    } catch (err) {
      console.error("공지사항 목록 로딩 실패:", err);
      // 404 오류가 발생하면 사용자에게 더 명확한 메시지를 보여줄 수 있습니다.
      if (err.response && err.response.status === 404) {
        setError("API 경로를 찾을 수 없습니다. 관리자에게 문의하세요.");
      } else {
        setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // --- 이벤트 핸들러 --- //
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchParams({ query: searchTerm, page: '1' });
  };

  const handlePageChange = (pageNumber) => {
    const currentQuery = searchParams.get('query') || '';
    setSearchParams({ query: currentQuery, page: pageNumber.toString() });
  };
  
  // 삭제 핸들러 (API 경로 수정)
  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] 공지사항을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        // *** 오류 수정: 삭제 요청 주소도 직접 구성합니다. ***
        const API_BASE_URL = import.meta.env.VITE_API_URL;
        await axios.delete(`${API_BASE_URL}/admin/notices/${id}`, {
          withCredentials: true
        });
        
        fetchNotices();
        alert('성공적으로 삭제되었습니다.');
      } catch (err) {
        console.error("공지사항 삭제 실패:", err);
        alert('삭제 처리 중 오류가 발생했습니다.');
      }
    }
  };

  // --- 렌더링 --- //
  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* 페이지 헤더 */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-800">공지사항 관리</h1>
          <Link
            to="/admin/notices/new"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <PlusCircle size={18} />
            새 글 작성
          </Link>
        </div>

        {/* 메인 컨텐츠 영역 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
            <p className="text-sm text-gray-600 self-start md:self-center">
              총 <span className="font-semibold text-blue-600">{totalNotices}</span>개의 게시물이 있습니다.
            </p>
            <form onSubmit={handleSearchSubmit} className="w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="제목, 내용으로 검색..."
                  className="w-full md:w-72 pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </form>
          </div>

          {/* 로딩 및 에러 메시지 표시 */}
          {loading && <div className="text-center py-16 text-gray-500">데이터를 불러오는 중입니다...</div>}
          {error && <div className="text-center py-16 text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>}

          {/* 공지사항 목록 테이블 */}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">조회수</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {notices.length > 0 ? (
                    notices.map((notice) => (
                      <tr key={notice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{notice.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <Link to={`/admin/notices/edit/${notice.id}`} className="hover:text-blue-600 hover:underline">
                            {notice.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">
                          {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{notice.viewCount || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center items-center gap-x-4">
                            <button
                              onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center gap-1 transition-colors"
                              aria-label={`${notice.title} 수정`}
                            >
                              <Edit size={16} />
                              <span>수정</span>
                            </button>
                            <button
                              onClick={() => handleDelete(notice.id)}
                              className="text-red-600 hover:text-red-900 flex items-center gap-1 transition-colors"
                              aria-label={`${notice.title} 삭제`}
                            >
                              <Trash2 size={16} />
                              <span>삭제</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center text-sm text-gray-500">
                        표시할 공지사항이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* 페이지네이션 */}
          {!loading && !error && totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNoticeListPage;
