import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Pagination from '../../components/Pagination'; // 1. Pagination 컴포넌트 import

function AdminConsultationListPage() {
  const [consultations, setConsultations] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      try {
        // 2. API 요청 시 현재 페이지 번호를 함께 보냅니다.
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/consultations?page=${currentPage}`;
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
  }, [currentPage]); // 3. 페이지 번호가 바뀔 때마다 데이터를 다시 불러옵니다.

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>상담 관리 | 연세미치과</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">온라인 상담 관리</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          {/* ... (테이블 a a a a헤더는 이전과 동일) ... */}
          <thead className="bg-gray-50"> <tr> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th> <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th> </tr> </thead>
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
      {/* 4. Pagination 컴포넌트를 추가합니다. */}
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
