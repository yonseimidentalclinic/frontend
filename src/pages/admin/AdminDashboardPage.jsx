// =================================================================
// 관리자 대시보드 페이지 (AdminDashboardPage.jsx) - UI/UX 개선 버전
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 주요 현황을 한눈에 볼 수 있는 통계 카드 디자인 적용
// 2. 'recharts' 라이브러리를 사용하여 콘텐츠 현황을 시각적인 막대 차트로 표시
// 3. 답변 대기 중인 상담이 있을 경우, 강조 알림 표시
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Megaphone, Newspaper, MessageSquare, Bell, AlertTriangle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/admin/dashboard-summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      setError('대시보드 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const chartData = [
    { name: '공지사항', count: stats?.totalNotices || 0 },
    { name: '자유게시판', count: stats?.totalPosts || 0 },
    { name: '온라인상담', count: stats?.totalConsultations || 0 },
  ];

  if (loading) {
    return <div className="p-10 text-center">대시보드 데이터를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">대시보드</h1>
        
        {/* 중요 알림 섹션 */}
        {stats?.unansweredConsultations > 0 && (
          <div className="mb-8 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg flex items-center shadow-md" role="alert">
            <AlertTriangle className="h-6 w-6 mr-3" />
            <div>
              <p className="font-bold">답변 대기 중인 상담이 {stats.unansweredConsultations}건 있습니다.</p>
              <p className="text-sm">신속한 답변 부탁드립니다.</p>
            </div>
          </div>
        )}
        
        {/* 통계 카드 그리드 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={MessageSquare} title="답변 대기 상담" value={stats?.unansweredConsultations || 0} linkTo="/admin/consultations" colorClass="border-red-500" />
          <StatCard icon={Bell} title="오늘 접수된 상담" value={stats?.todayConsultations || 0} linkTo="/admin/consultations" colorClass="border-yellow-500" />
          <StatCard icon={Newspaper} title="총 자유게시판 글" value={stats?.totalPosts || 0} linkTo="/admin/posts" colorClass="border-green-500" />
          <StatCard icon={Megaphone} title="총 공지사항" value={stats?.totalNotices || 0} linkTo="/admin/notices" colorClass="border-blue-500" />
        </div>
        
        {/* 콘텐츠 현황 차트 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">콘텐츠 현황</h2>
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
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
