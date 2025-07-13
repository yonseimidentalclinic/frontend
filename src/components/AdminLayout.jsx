import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // localStorage에 저장된 토큰을 삭제합니다.
    localStorage.removeItem('adminToken');
    // 병원 홈페이지 메인 화면으로 이동시킵니다.
    navigate('/');
  };

  // NavLink에서 활성화된 메뉴 스타일
  const activeLinkStyle = {
    backgroundColor: '#2563eb', // bg-blue-600
    color: 'white',
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 사이드바 */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">
          연세미치과 관리
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <NavLink
            to="/admin/dashboard"
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)}
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            대시보드
          </NavLink>
          <NavLink 
            to="/admin/consultations" 
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            상담 관리
          </NavLink>
          <NavLink 
            to="/admin/notices" 
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            공지사항 관리
          </NavLink>
          <NavLink 
            to="/admin/posts" 
            style={({ isActive }) => (isActive ? activeLinkStyle : undefined)} 
            className="block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
          >
            자유게시판 관리
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 rounded transition duration-200 bg-red-600 hover:bg-red-700"
          >
            로그아웃
          </button>
        </div>
      </aside>

      {/* 메인 컨텐츠 */}
      <main className="flex-grow p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
