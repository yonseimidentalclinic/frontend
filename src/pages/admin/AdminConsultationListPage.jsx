import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Pagination from '../../components/Pagination';

function AdminConsultationListPage() {
  const [consultations, setConsultations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const token = localStorage.getItem('adminToken');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/consultations?page=${currentPage}&search=${currentSearch}`;
        const response = await axios.get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        setConsultations(response.data.data);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error("Failed to fetch consultations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, [currentPage, currentSearch]);

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber, search: currentSearch });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: 1, search: searchTerm });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>상담 관리 | 연세미치과</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">온라인 상담 관리</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목 또는 작성자로 검색"
            className="px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700">검색</button>
        </form>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultations.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.reply ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">답변 완료</span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">대기중</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link to={`/admin/consultations/${item.id}`} className="text-sm font-medium text-blue-600 hover:text-blue-900">
                    {item.title}
                    {item.is_secret && ' 🔒'}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
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

export default AdminConsultationListPage;
