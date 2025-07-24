// src/components/AdminLayout.jsx

import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, Clock, Building, Users, Image, Star,
  HelpCircle, Newspaper, MessageSquare, LogOut, History, UserCheck
} from 'lucide-react';

const SidebarLink = ({ to, icon: Icon, children }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(`/admin/${to}`);
  
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200 ${isActive ? 'bg-gray-700 font-semibold' : ''}`}
    >
      <Icon className="h-5 w-5 mr-3" />
      <span>{children}</span>
    </Link>
  );
};

const AdminLayout = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    if (window.confirm('정말로 로그아웃하시겠습니까?')) {
      localStorage.removeItem('accessToken');
      navigate('/'); // 로그아웃 시 홈 화면으로 이동
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4">
        <div className="text-2xl font-bold mb-8 px-4">
          <Link to="/admin">연세미치과 관리</Link>
        </div>
        <nav className="flex-grow space-y-2">
          <SidebarLink to="dashboard" icon={LayoutDashboard}>대시보드</SidebarLink>
          <SidebarLink to="logs" icon={History}>접근 기록</SidebarLink>
          
          <p className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 px-4">사용자</p>
          <SidebarLink to="users" icon={UserCheck}>회원 관리</SidebarLink>

          <p className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 px-4">예약/환자</p>
          <SidebarLink to="reservations" icon={Calendar}>예약 관리</SidebarLink>
          <SidebarLink to="schedule" icon={Clock}>스케줄 관리</SidebarLink>
          <SidebarLink to="reviews" icon={Star}>후기 관리</SidebarLink>

          <p className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 px-4">콘텐츠</p>
          <SidebarLink to="about" icon={Building}>병원소개 관리</SidebarLink>
          <SidebarLink to="doctors" icon={Users}>의료진 관리</SidebarLink>
          <SidebarLink to="cases" icon={Image}>치료사례 관리</SidebarLink>
          <SidebarLink to="faqs" icon={HelpCircle}>FAQ 관리</SidebarLink>
          
          <p className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 px-4">게시판</p>
          <SidebarLink to="notices" icon={Newspaper}>공지사항 관리</SidebarLink>
          <SidebarLink to="posts" icon={MessageSquare}>자유게시판 관리</SidebarLink>
          <SidebarLink to="consultations" icon={MessageSquare}>온라인상담 관리</SidebarLink>
        </nav>
        <div className="mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 bg-red-900 bg-opacity-50 text-red-300 hover:bg-opacity-75 rounded-lg transition-colors duration-200">
            <LogOut className="h-5 w-5 mr-3" />
            <span>로그아웃</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
