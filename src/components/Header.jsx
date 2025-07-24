// src/components/Header.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    end // '홈' 메뉴가 다른 경로에서 활성화되지 않도록 end prop 추가
    className={({ isActive }) =>
      `block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 ${
        isActive 
        ? 'text-indigo-600 font-semibold' 
        : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-600'
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileNavItem = ({ to, children, onClick }) => (
    <NavLink
      to={to}
      onClick={onClick}
      end
      className={({ isActive }) =>
        `block px-4 py-3 rounded-md text-base font-medium ${
          isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-gray-100'
        }`
      }
    >
      {children}
    </NavLink>
);

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className={`bg-white sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : 'shadow-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-indigo-700">
              연세미치과
            </Link>
          </div>
          <nav className="hidden md:flex items-center space-x-2">
            {/* --- 핵심 추가: 홈 버튼을 메뉴 가장 앞에 추가했습니다. --- */}
            <NavItem to="/">홈</NavItem>
            <NavItem to="/about">병원소개</NavItem>
            <NavItem to="/doctors">의료진</NavItem>
            <NavItem to="/cases">치료사례</NavItem>
            <NavItem to="/reviews">치료후기</NavItem>
            <NavItem to="/notices">병원소식</NavItem>
            <NavItem to="/posts">자유게시판</NavItem>
            <NavItem to="/consultations">온라인상담</NavItem>
            <NavItem to="/faq">FAQ</NavItem>
            <NavItem to="/location">오시는 길</NavItem>
          </nav>
          
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <NavLink to="/mypage" className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                  <User size={16} /> 마이페이지
                </NavLink>
                <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-600">
                  <LogOut size={16} /> 로그아웃
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="text-sm font-medium text-slate-600 hover:text-indigo-600">로그인</NavLink>
                <Link to="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700">
                  회원가입
                </Link>
              </>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:bg-slate-100 focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-white shadow-lg ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <MobileNavItem to="/" onClick={() => setIsOpen(false)}>홈</MobileNavItem>
          <MobileNavItem to="/about" onClick={() => setIsOpen(false)}>병원소개</MobileNavItem>
          <MobileNavItem to="/doctors" onClick={() => setIsOpen(false)}>의료진</MobileNavItem>
          <MobileNavItem to="/cases" onClick={() => setIsOpen(false)}>치료사례</MobileNavItem>
          <MobileNavItem to="/reviews" onClick={() => setIsOpen(false)}>치료후기</MobileNavItem>
          <MobileNavItem to="/notices" onClick={() => setIsOpen(false)}>병원소식</MobileNavItem>
          <MobileNavItem to="/posts" onClick={() => setIsOpen(false)}>자유게시판</MobileNavItem>
          <MobileNavItem to="/consultations" onClick={() => setIsOpen(false)}>온라인상담</MobileNavItem>
          <MobileNavItem to="/faq" onClick={() => setIsOpen(false)}>FAQ</MobileNavItem>
          <MobileNavItem to="/location" onClick={() => setIsOpen(false)}>오시는 길</MobileNavItem>
          
          <div className="border-t my-4"></div>

          {user ? (
              <>
                <MobileNavItem to="/mypage" onClick={() => setIsOpen(false)}>마이페이지</MobileNavItem>
                <button onClick={() => { logout(); setIsOpen(false); }} className="w-full text-left block px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-gray-100">
                  로그아웃
                </button>
              </>
          ) : (
              <>
                <MobileNavItem to="/login" onClick={() => setIsOpen(false)}>로그인</MobileNavItem>
                <MobileNavItem to="/register" onClick={() => setIsOpen(false)}>회원가입</MobileNavItem>
              </>
          )}

          <div className="mt-4 px-2">
            <Link 
              to="/reservation"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-indigo-600 text-white px-5 py-3 rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors"
            >
              온라인 예약
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
