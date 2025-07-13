import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';
import Pagination from '/src/components/Pagination.jsx';
import LoadingSpinner from '/src/components/LoadingSpinner.jsx';

const AdminNoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();

  const fetchNotices = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/notices?page=${page}&limit=10`);
      // API 응답 데이터가 배열인지 확인하여 안정성 확보
      if (Array.isArray(response.data.notices)) {
        setNotices(response.data.notices);
        setTotalPages(response.data.totalPages);
      } else {
        // 예상치 못한 데이터 형태일 경우 에러 처리
        console.error("API did not return an array for notices:", response.data);
        setNotices([]);
        setError('공지사항 데이터를 불러오는 데 실패했습니다. 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('공지사항 로딩 실패:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await api.delete(`/notices/${id}`);
        alert('공지사항이 삭제되었습니다.');
        if (notices.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchNotices(currentPage);
        }
      } catch (err) {
        console.error('공지사항 삭제 실패:', err);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">공지사항 관리</h1>
        <Link to="/admin/notices/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          새 글 작성
        </Link>
      </div>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {notices.length > 0 ? notices.map((notice) => (
                  <tr key={notice.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{notice.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{notice.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(notice.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/notices/edit/${notice.id}`)}
                        className="px-3 py-1 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="text-center py-10 text-gray-500">작성된 공지사항이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default AdminNoticeListPage;
