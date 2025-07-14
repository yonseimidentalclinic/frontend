import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';
import Pagination from '/src/components/Pagination.jsx';
import LoadingSpinner from '/src/components/LoadingSpinner.jsx';

const AdminNoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async (page) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/notices?page=${page}&limit=10`);
        if (response.data && Array.isArray(response.data.notices)) {
          setNotices(response.data.notices);
          setTotalPages(response.data.totalPages);
        } else {
          setNotices([]);
          setTotalPages(0);
          setError('공지사항 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error('공지사항 로딩 실패:', err);
        setError('서버와 통신 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
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
            const fetchNotices = async (page) => {
                const response = await api.get(`/notices?page=${page}&limit=10`);
                setNotices(response.data.notices);
                setTotalPages(response.data.totalPages);
            };
            fetchNotices(currentPage);
        }
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">공지사항 관리</h1>
        <Link to="/admin/notices/new" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">새 글 작성</Link>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">제목</th>
              <th className="px-6 py-3 text-left">작성일</th>
              <th className="px-6 py-3 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notices.length > 0 ? notices.map((notice) => (
              <tr key={notice.id}>
                <td className="px-6 py-4">{notice.id}</td>
                <td className="px-6 py-4">{notice.title}</td>
                <td className="px-6 py-4">{new Date(notice.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-center space-x-2">
                  <button onClick={() => navigate(`/admin/notices/edit/${notice.id}`)} className="px-3 py-1 bg-green-500 text-white rounded-md">수정</button>
                  <button onClick={() => handleDelete(notice.id)} className="px-3 py-1 bg-red-500 text-white rounded-md">삭제</button>
                </td>
              </tr>
            )) : <tr><td colSpan="4" className="text-center py-10">공지사항이 없습니다.</td></tr>}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />}
    </div>
  );
};

export default AdminNoticeListPage;
