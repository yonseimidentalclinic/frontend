import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import axios from 'axios';

function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('인증 토큰이 없습니다. 다시 로그인해주세요.');
        setLoading(false);
        return;
      }

      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/dashboard`;
        const response = await axios.get(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}` // 헤더에 인증 토큰을 포함하여 보냅니다.
          }
        });
        setDashboardData(response.data);
      } catch (err) {
        setError('대시보드 데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-10">대시보드 데이터를 불러오는 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <>
      <Helmet>
        <title>관리자 대시보드 | 연세미치과</title>
      </Helmet>
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">관리자 대시보드</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 최신 온라인 상담 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최신 온라인 상담</h2>
            <ul>
              {dashboardData?.latestConsultations.map(item => (
                <li key={item.id} className="border-b py-2">
                  <Link to={`/consultations/${item.id}`} className="hover:text-blue-600">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.author} - {new Date(item.created_at).toLocaleDateString()}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* 최신 공지사항 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최신 공지사항</h2>
            <ul>
              {dashboardData?.latestNotices.map(item => (
                <li key={item.id} className="border-b py-2">
                  <Link to={`/notices/${item.id}`} className="hover:text-blue-600">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
