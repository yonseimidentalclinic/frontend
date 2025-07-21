// src/pages/admin/AdminDashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Megaphone, Newspaper, MessageSquare, Bell, AlertTriangle, Users, History } from 'lucide-react';

// 통계 카드 컴포넌트
const StatCard = ({ icon: Icon, title, value, linkTo, colorClass }) => (
    <Link to={linkTo} className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-l-4 ${colorClass}`}>
        <div className="flex justify-between items-start">
            <p className="text-lg font-semibold text-gray-700">{title}</p>
            <div className={`p-3 rounded-full bg-opacity-20 ${colorClass.replace('border-', 'bg-')}`}>
                <Icon className={`h-7 w-7 ${colorClass.replace('border-', 'text-')}`} />
            </div>
        </div>
        <p className="text-4xl font-bold text-gray-900 mt-2">{value}</p>
    </Link>
);

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null); // 차트 데이터 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const statsPromise = api.get('/admin/dashboard-stats');
      const chartsPromise = api.get('/admin/dashboard-charts'); // 새 API 호출

      const [statsResponse, chartsResponse] = await Promise.all([
        statsPromise,
        chartsPromise,
      ]);

      setStats(statsResponse.data);
      setChartData(chartsResponse.data); // 차트 데이터 설정

    } catch (err) {
      console.error("대시보드 데이터 로딩 실패:", err);
      if (err.response?.status !== 401) {
        setError('대시보드 데이터를 불러오는 데 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <div className="p-10 text-center text-gray-600">대시보드 데이터를 불러오는 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-lg">{error}</div>;

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">대시보드</h1>
        
        {stats?.unansweredConsultations > 0 && (
          <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg flex items-center shadow-md" role="alert">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">답변 대기 중인 상담이 {stats.unansweredConsultations}건 있습니다.</p>
              <p className="text-sm">신속한 답변 부탁드립니다.</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={MessageSquare} title="답변 대기 상담" value={stats?.unansweredConsultations || 0} linkTo="/admin/consultations" colorClass="border-red-500" />
          <StatCard icon={Bell} title="오늘 접수된 상담" value={stats?.todayConsultations || 0} linkTo="/admin/consultations" colorClass="border-yellow-500" />
          <StatCard icon={Newspaper} title="총 자유게시판 글" value={stats?.totalPosts || 0} linkTo="/admin/posts" colorClass="border-green-500" />
          <StatCard icon={Megaphone} title="총 공지사항" value={stats?.totalNotices || 0} linkTo="/admin/notices" colorClass="border-blue-500" />
        </div>
        
        {/* --- [새 기능] 통계 차트 그리드 --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 주간 상담 접수 현황 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">주간 상담 접수 현황</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData?.weeklyConsultations} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="상담 수" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 월별 게시물 작성 추이 */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">월별 게시물 작성 추이</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData?.monthlyPosts} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="게시물 수" fill="#4338ca" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
