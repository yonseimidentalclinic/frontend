// =================================================================
// 프론트엔드 Header 컴포넌트 (Header.jsx)
// 파일 경로: /src/components/Header.jsx
// 주요 기능:
// 1. 홈페이지 로고 및 상단 네비게이션 메뉴 표시
// 2. 모바일 화면에서 햄버거 메뉴 기능 제공
// =================================================================

import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const commonLinkClass = "text-gray-600 hover:text-blue-600 transition-colors duration-200 font-semibold";
  const activeLinkClass = "text-blue-600 border-b-2 border-blue-600";
  
  const mobileLinkClass = "block py-2 px-4 text-lg text-gray-700 hover:bg-gray-100";
  const mobileActiveLinkClass = "bg-blue-100 text-blue-600 font-bold";

  const navLinks = [
    { to: "/about", text: "병원소개" },
    { to: "/doctors", text: "의료진 소개" },
    { to: "/services", text: "진료안내" },
    { to: "/news", text: "병원소식" },
    { to: "/consultation", text: "온라인 상담" },
    { to: "/community/posts", text: "자유게시판" },
    { to: "/location", text: "오시는 길" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* 로고 */} 
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              연세미치과
            </Link>
          </div>

          {/* 데스크탑 메뉴 */}
          <nav className="hidden md:flex md:space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `${commonLinkClass} ${isActive ? activeLinkClass : ''} py-7`}
              >
                {link.text}
              </NavLink>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 (펼쳐졌을 때) */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => `${mobileLinkClass} ${isActive ? mobileActiveLinkClass : ''}`}
              >
                {link.text}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
