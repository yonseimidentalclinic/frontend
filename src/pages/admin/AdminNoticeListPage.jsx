// src/pages/admin/AdminNoticeListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
// 프로젝트의 API 서비스 유틸리티를 임포트합니다.
import api from '../../services/api'; 
// *** 오류 수정: Pagination 컴포넌트의 경로를 수정했습니다. ***
// 'common' 폴더가 없을 가능성을 고려하여 경로를 조정합니다.
// 만약 이 경로도 아니라면, 프로젝트 내 Pagination.jsx 파일의 실제 위치를 확인해주세요.
import Pagination from '../../components/Pagination'; 
// UI 개선을 위해 아이콘을 사용합니다. (lucide-react 라이브러리 사용 가정)
import { Search, Edit, Trash2, PlusCircle } from 'lucide-react';

const AdminNoticeListPage = () => {
  // --- 상태 관리 (State Management) --- //

  // 공지사항 목록을 저장할 상태
  const [notices, setNotices] = useState([]); 
  // 데이터 로딩 상태
  const [loading, setLoading] = useState(true); 
  // 에러 발생 시 에러 메시지를 저장할 상태
  const [error, setError] = useState(null); 
  // 현재 페이지 번호
  const [currentPage, setCurrentPage] = useState(1);
  // 전체 페이지 수
  const [totalPages, setTotalPages] = useState(1);
  // 전체 공지사항 개수
  const [totalNotices, setTotalNotices] = useState(0);
  // 사용자가 입력하는 검색어
  const [searchTerm, setSearchTerm] = useState('');

  // --- React Router Hooks --- //
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // --- 데이터 로딩 함수 --- //

  // 백엔드 API로부터 공지사항 목록을 가져오는 함수
  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // URL 쿼리 파라미터에서 'page'와 'query' 값을 가져옵니다. 없으면 기본값을 사용합니다.
      const page = searchParams.get('page') || '1';
      const query = searchParams.get('query') || '';

      // 백엔드에 GET 요청을 보냅니다.
      const response = await api.get('/admin/notices', {
        params: { page, query },
      });
      
      // API 응답으로 상태를 업데이트합니다.
      setNotices(response.data.notices);
      setTotalPages(response.data.totalPages);
      setTotalNotices(response.data.totalCount);
      setCurrentPage(parseInt(page, 10));
      setSearchTerm(query); // URL 쿼리와 검색창 입력값을 동기화

    } catch (err) {
      console.error("공지사항 목록 로딩 실패:", err);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [searchParams]); // searchParams가 변경될 때마다 함수를 재생성합니다.

  // 컴포넌트가 처음 렌더링되거나, searchParams가 바뀔 때 공지사항 목록을 불러옵니다.
  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  // --- 이벤트 핸들러 --- //

  // 검색창 입력값이 변경될 때마다 searchTerm 상태를 업데이트합니다.
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // 검색 버튼을 클릭하거나 Enter 키를 누르면 검색을 실행합니다.
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // URL 쿼리를 업데이트하여 검색 결과의 1페이지로 이동합니다.
    setSearchParams({ query: searchTerm, page: '1' });
  };

  // 페이지네이션 컴포넌트에서 페이지 번호를 클릭했을 때 실행됩니다.
  const handlePageChange = (pageNumber) => {
    const currentQuery = searchParams.get('query') || '';
    setSearchParams({ query: currentQuery, page: pageNumber.toString() });
  };
  
  // 삭제 버튼 클릭 시 실행되는 핸들러
  const handleDelete = async (id) => {
    // 사용자에게 삭제 여부를 다시 한 번 확인받습니다.
    if (window.confirm(`[ID: ${id}] 공지사항을 정말로 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await api.delete(`/admin/notices/${id}`);
        // 삭제 성공 시, 목록을 다시 불러와 화면을 갱신합니다.
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
                          <Link to={`/admin/notices/${notice.id}`} className="hover:text-blue-600 hover:underline">
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
                              onClick={() => navigate(`/admin/notices/${notice.id}`)}
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
