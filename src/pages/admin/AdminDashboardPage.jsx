// =================================================================
// 관리자 대시보드 페이지 (AdminDashboardPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 서버에서 통계 데이터를 불러와 상태 카드로 표시
// 2. 답변 대기 중인 상담이 있을 경우 강조 표시
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Megaphone, Newspaper, MessageSquare, User, HelpCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const StatCard = ({ icon, title, value, linkTo }) => {
  const Icon = icon;
  return (
    <Link to={linkTo} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center">
      <div className="bg-blue-100 p-4 rounded-full">
        <Icon className="h-8 w-8 text-blue-600" />
      </div>
      <div className="ml-4">
        <p className="text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
    </Link>
  );
};

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data);
    } catch (err) {
      setError('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <div className="p-10 text-center">대시보드 데이터를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="p-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">관리자 대시보드</h1>
        
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard icon={MessageSquare} title="총 온라인 상담" value={stats?.totalConsultations || 0} linkTo="/admin/consultations" />
          <StatCard icon={HelpCircle} title="답변 대기 상담" value={stats?.unansweredConsultations || 0} linkTo="/admin/consultations" />
          <StatCard icon={Newspaper} title="총 자유게시판 글" value={stats?.totalPosts || 0} linkTo="/admin/posts" />
          <StatCard icon={Megaphone} title="총 공지사항" value={stats?.totalNotices || 0} linkTo="/admin/notices" />
        </div>

        {/* 오늘 접수된 상담 알림 */}
        {stats?.todayConsultations > 0 && (
          <div className="mt-8 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md" role="alert">
            <p className="font-bold">새로운 상담</p>
            <p>오늘 {stats.todayConsultations}개의 새로운 온라인 상담이 접수되었습니다. 빠른 답변 부탁드립니다.</p>
          </div>
        )}

        <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">환영합니다!</h2>
          <p className="text-gray-600">
            이곳에서 홈페이지의 주요 콘텐츠를 관리할 수 있습니다. <br />
            왼쪽 메뉴를 통해 각 항목을 확인하고 관리해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
