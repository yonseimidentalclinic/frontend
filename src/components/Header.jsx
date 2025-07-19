// src/components/Header.jsx

import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
        isActive ? 'text-white bg-indigo-700' : 'text-gray-300 hover:text-white hover:bg-indigo-600'
      }`
    }
  >
    {children}
  </NavLink>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-indigo-800 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-white text-2xl font-bold">
              연세미치과
            </Link>
          </div>
          <div className="hidden md:block">
            <nav className="ml-10 flex items-baseline space-x-4">
              <NavItem to="/about">병원소개</NavItem>
              <NavItem to="/doctors">의료진</NavItem>
              <NavItem to="/cases">치료사례</NavItem>
              {/* --- 핵심 수정: /community 경로를 모두 제거했습니다. --- */}
              <NavItem to="/notices">병원소식</NavItem>
              <NavItem to="/posts">자유게시판</NavItem>
              <NavItem to="/consultations">온라인상담</NavItem>
              <NavItem to="/faq">FAQ</NavItem>
              <NavItem to="/location">오시는 길</NavItem>
            </nav>
          </div>
          <div className="hidden md:block">
             <Link to="/reservation" className="bg-white text-indigo-800 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                온라인 예약
             </Link>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavItem to="/about">병원소개</NavItem>
            <NavItem to="/doctors">의료진</NavItem>
            <NavItem to="/cases">치료사례</NavItem>
            <NavItem to="/notices">병원소식</NavItem>
            <NavItem to="/posts">자유게시판</NavItem>
            <NavItem to="/consultations">온라인상담</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            <NavItem to="/location">오시는 길</NavItem>
            <NavItem to="/reservation">온라인 예약</NavItem>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
