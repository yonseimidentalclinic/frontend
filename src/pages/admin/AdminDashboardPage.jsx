import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '/src/services/api.js';
import LoadingSpinner from '/src/components/LoadingSpinner.jsx';

const AdminDashboardPage = () => {
  const [data, setData] = useState({ notices: [], consultations: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get('/admin/dashboard');
        // 데이터가 올바른 형식인지 확인
        if (response.data && Array.isArray(response.data.notices) && Array.isArray(response.data.consultations)) {
            setData(response.data);
        } else {
            setError('대시보드 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (err) {
        console.error('대시보드 데이터 로딩 실패:', err);
        setError('서버와 통신 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">최신 공지사항</h2>
          <ul>
            {data.notices.length > 0 ? data.notices.map(notice => (
              <li key={notice.id} className="border-b py-2 flex justify-between">
                <Link to={`/notices/${notice.id}`} className="text-blue-600 hover:underline">{notice.title}</Link>
                <span className="text-sm text-gray-500">{new Date(notice.createdAt).toLocaleDateString()}</span>
              </li>
            )) : <p className="text-gray-500">최신 공지사항이 없습니다.</p>}
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">최신 온라인 상담</h2>
          <ul>
            {data.consultations.length > 0 ? data.consultations.map(consult => (
              <li key={consult.id} className="border-b py-2 flex justify-between">
                <Link to={`/admin/consultations/${consult.id}`} className="text-blue-600 hover:underline">{consult.title}</Link>
                <span className="text-sm text-gray-500">{new Date(consult.createdAt).toLocaleDateString()}</span>
              </li>
            )) : <p className="text-gray-500">최신 상담글이 없습니다.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;