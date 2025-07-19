// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-gray-400 hover:text-white transition-colors duration-200">
    {children}
  </Link>
);

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* 정보 섹션 */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">연세미치과</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              환자 한 분 한 분의 건강한 미소를 위해, <br />
              저희는 보이지 않는 곳까지 정성을 다합니다.
            </p>
          </div>

          {/* 바로가기 메뉴 섹션 */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">바로가기</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/about">병원소개</FooterLink></li>
              <li><FooterLink to="/doctors">의료진</FooterLink></li>
              <li><FooterLink to="/cases">치료사례</FooterLink></li>
            </ul>
          </div>

          {/* 게시판 메뉴 섹션 */}
          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">커뮤니티</h3>
            <ul className="space-y-3">
              <li><FooterLink to="/notices">병원소식</FooterLink></li>
              <li><FooterLink to="/posts">자유게시판</FooterLink></li>
              <li><FooterLink to="/consultations">온라인상담</FooterLink></li>
              <li><FooterLink to="/faq">자주 묻는 질문</FooterLink></li>
            </ul>
          </div>

          {/* 예약 섹션 */}
           <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase mb-4">예약 및 문의</h3>
            <ul className="space-y-3">
               <li><FooterLink to="/reservation">온라인 예약</FooterLink></li>
               <li><FooterLink to="/location">오시는 길</FooterLink></li>
               <li className="text-gray-400">전화: 02-1234-5678</li>
            </ul>
          </div>

        </div>

        {/* 하단 저작권 */}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {new Date().getFullYear()} 연세미치과. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            주소: 서울특별시 서대문구 연세로 50 | 대표: 박건현
          </p>
          {/* --- 핵심 추가: 관리자 페이지로 이동하는 링크를 추가했습니다. --- */}
          <div className="mt-4">
            <Link to="/admin" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              관리자 페이지
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
