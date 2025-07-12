import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function AdminConsultationListPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/consultations`;
        const response = await axios.get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        setConsultations(response.data);
      } catch (error) {
        console.error("Failed to fetch consultations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>상담 관리 | 연세미치과</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">온라인 상담 관리</h1>
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
    </>
  );
}

export default AdminConsultationListPage;
