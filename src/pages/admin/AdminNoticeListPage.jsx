import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '/src/services/api.js'; // 경로 수정
import Pagination from '/src/components/Pagination.jsx'; // 경로 수정

const AdminNoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchNotices = async (page) => {
    try {
      const response = await api.get(`/notices?page=${page}&limit=10`);
      setNotices(response.data.notices);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('공지사항 로딩 실패:', error);
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
      } catch (error) {
        console.error('공지사항 삭제 실패:', error);
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
            {notices.map((notice) => (
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
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminNoticeListPage;
