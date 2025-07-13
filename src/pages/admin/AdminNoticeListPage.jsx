import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Pagination from '../../components/Pagination';

function AdminNoticeListPage() {
  const [notices, setNotices] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  
  const token = localStorage.getItem('adminToken');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearch = searchParams.get('search') || '';

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/notices?page=${currentPage}&search=${currentSearch}`;
      const response = await axios.get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      setNotices(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch notices", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [currentPage, currentSearch]);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 공지사항을 삭제하시겠습니까?')) {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/notices/${id}`;
        await axios.delete(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        alert('삭제되었습니다.');
        fetchNotices(); // 목록 새로고침
      } catch (error) {
        alert('삭제에 실패했습니다.');
        console.error("Failed to delete notice", error);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: 1, search: searchTerm });
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber, search: currentSearch });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>공지사항 관리 | 연세미치과</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">공지사항 관리</h1>
        <Link to="/admin/notices/new" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">새 글 작성</Link>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 또는 내용으로 검색"
            className="px-3 py-2 border rounded w-full"
          />
          <button type="submit" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 flex-shrink-0">검색</button>
      </form>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {notices.map(notice => (
              <tr key={notice.id}>
                <td className="px-6 py-4">{notice.title}</td>
                <td className="px-6 py-4">{new Date(notice.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 space-x-2">
                  <Link to={`/admin/notices/edit/${notice.id}`} className="text-indigo-600 hover:text-indigo-900">수정</Link>
                  <button onClick={() => handleDelete(notice.id)} className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

export default AdminNoticeListPage;
