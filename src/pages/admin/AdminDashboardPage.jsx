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
            'Authorization': `Bearer ${token}`
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
        
        <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">빠른 작업</h2>
            <div className="flex flex-wrap gap-4">
                <Link to="/admin/notices/new" className="bg-blue-600 text-white font-semibold py-2 px-6 rounded hover:bg-blue-700 transition duration-300">
                    새 병원소식 작성
                </Link>
                <Link to="/admin/consultations" className="bg-green-600 text-white font-semibold py-2 px-6 rounded hover:bg-green-700 transition duration-300">
                    상담글 전체보기
                </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최신 온라인 상담</h2>
            {dashboardData?.latestConsultations.length > 0 ? (
              <ul>
                {dashboardData.latestConsultations.map(item => (
                  <li key={item.id} className="border-b last:border-b-0 py-2">
                    <Link to={`/admin/consultations/${item.id}`} className="hover:text-blue-600 group">
                      <p className="font-semibold group-hover:underline">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.author} - {new Date(item.created_at).toLocaleDateString()}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">최근 상담 내역이 없습니다.</p>
            )}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">최신 공지사항</h2>
            {dashboardData?.latestNotices.length > 0 ? (
              <ul>
                {dashboardData.latestNotices.map(item => (
                  <li key={item.id} className="border-b last:border-b-0 py-2">
                    <Link to={`/notices/${item.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 group">
                      <p className="font-semibold group-hover:underline">{item.title}</p>
                      <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleDateString()}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">최근 공지사항이 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
