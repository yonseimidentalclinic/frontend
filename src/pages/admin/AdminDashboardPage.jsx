// src/pages/admin/AdminDashboardPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Megaphone, Newspaper, MessageSquare, Bell, AlertTriangle, Calendar, Star, FileText } from 'lucide-react';

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

// 시간 차이를 계산하는 헬퍼 함수
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "년 전";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "달 전";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "일 전";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "시간 전";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "분 전";
  return "방금 전";
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]); // 활동 피드 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, chartsRes, feedRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/dashboard-charts'),
        api.get('/admin/dashboard/activity-feed') // 새 API 호출
      ]);
      setStats(statsRes.data);
      setChartData(chartsRes.data);
      setActivityFeed(feedRes.data); // 활동 피드 데이터 설정
    } catch (err) {
      setError('대시보드 데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const contentStatusChartData = [
    { name: '공지사항', count: stats?.totalNotices || 0 },
    { name: '자유게시판', count: stats?.totalPosts || 0 },
    { name: '온라인상담', count: stats?.totalConsultations || 0 },
  ];

  // 활동 유형에 따라 아이콘과 메시지를 반환하는 객체
  const activityDetails = {
    reservation: { icon: Calendar, text: '새로운 예약 신청:', link: '/admin/reservations', color: 'text-green-500' },
    review: { icon: Star, text: '새로운 치료 후기:', link: '/admin/reviews', color: 'text-yellow-500' },
    consultation: { icon: MessageSquare, text: '새로운 온라인상담:', link: '/admin/consultations', color: 'text-blue-500' },
    post: { icon: FileText, text: '새로운 자유게시판 글:', link: '/admin/posts', color: 'text-gray-500' },
  };

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

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

        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">전체 콘텐츠 현황</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentStatusChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="게시물 수" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">최신 활동 피드</h2>
          <div className="space-y-4">
            {activityFeed.length > 0 ? activityFeed.map(item => {
              const details = activityDetails[item.type];
              if (!details) return null;
              const Icon = details.icon;
              return (
                <div key={`${item.type}-${item.id}`} className="flex items-start p-3 hover:bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full bg-gray-100 mr-4 ${details.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-gray-500">{details.text}</p>
                    <Link to={details.link} className="font-semibold text-gray-800 hover:underline">
                      {item.title}
                    </Link>
                  </div>
                  <p className="text-sm text-gray-400 flex-shrink-0">{timeSince(item.createdAt)}</p>
                </div>
              );
            }) : <p className="text-center text-gray-500 py-4">최근 활동 내역이 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
