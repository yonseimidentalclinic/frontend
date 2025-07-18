// =================================================================
// 프론트엔드 관리자 메뉴 컴포넌트 (AdminSidebar.jsx)
// 최종 업데이트: 2025년 7월 18일
// 주요 개선사항:
// 1. '후기 관리' 메뉴 항목을 새로 추가
// =================================================================

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Newspaper, MessageSquare, LogOut, UserSquare, Home, CalendarCheck, Camera, HelpCircle, Star } from 'lucide-react';

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('정말로 로그아웃하시겠습니까?')) {
      localStorage.removeItem('accessToken');
      window.location.href = '/';
    }
  };

  const commonLinkClass = "flex items-center px-4 py-3 text-gray-200 hover:bg-gray-700 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-gray-700 font-semibold";

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="px-6 py-4 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">연세미치과</h1>
        <p className="text-sm text-gray-400">관리자 페이지</p>
      </div>
      <nav className="flex-grow px-4 py-4 space-y-1">
        <NavLink to="/admin" end className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <LayoutDashboard className="w-5 h-5 mr-3" />
          대시보드
        </NavLink>
        <NavLink to="/admin/reservations" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <CalendarCheck className="w-5 h-5 mr-3" />
          예약 관리
        </NavLink>
        <NavLink to="/admin/about" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <Home className="w-5 h-5 mr-3" />
          병원소개 관리
        </NavLink>
        <NavLink to="/admin/doctors" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <UserSquare className="w-5 h-5 mr-3" />
          의료진 관리
        </NavLink>
        <NavLink to="/admin/cases" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <Camera className="w-5 h-5 mr-3" />
          치료 사례 관리
        </NavLink>
        {/* [핵심 추가] 후기 관리 메뉴 */}
        <NavLink to="/admin/reviews" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <Star className="w-5 h-5 mr-3" />
          후기 관리
        </NavLink>
        <NavLink to="/admin/faqs" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <HelpCircle className="w-5 h-5 mr-3" />
          FAQ 관리
        </NavLink>
        <NavLink to="/admin/notices" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <Megaphone className="w-5 h-5 mr-3" />
          공지사항 관리
        </NavLink>
        <NavLink to="/admin/posts" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <Newspaper className="w-5 h-5 mr-3" />
          자유게시판 관리
        </NavLink>
        <NavLink to="/admin/consultations" className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''}`}>
          <MessageSquare className="w-5 h-5 mr-3" />
          온라인상담 관리
        </NavLink>
      </nav>
      <div className="px-4 py-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-200 hover:bg-red-800 rounded-lg">
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
