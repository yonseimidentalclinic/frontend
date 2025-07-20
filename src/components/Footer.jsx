// src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle } from 'lucide-react';

const FooterLink = ({ to, children }) => (
  <Link to={to} className="text-slate-400 hover:text-indigo-400 transition-colors duration-300">
    {children}
  </Link>
);

const SocialLink = ({ href, icon: Icon }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-400 transition-colors duration-300">
        <Icon className="h-6 w-6" />
    </a>
)

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <h2 className="text-3xl font-bold text-white">연세미치과</h2>
            <p className="text-slate-400 text-base max-w-xs">
              환자 한 분 한 분의 건강한 미소를 위해, 저희는 보이지 않는 곳까지 정성을 다합니다.
            </p>
            <div className="flex space-x-6">
              <SocialLink href="#" icon={Facebook} />
              <SocialLink href="#" icon={Instagram} />
              <SocialLink href="#" icon={MessageCircle} />
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">바로가기</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink to="/about">병원소개</FooterLink></li>
                  <li><FooterLink to="/doctors">의료진</FooterLink></li>
                  <li><FooterLink to="/cases">치료사례</FooterLink></li>
                  <li><FooterLink to="/reviews">치료후기</FooterLink></li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">커뮤니티</h3>
                <ul className="mt-4 space-y-4">
                  <li><FooterLink to="/notices">병원소식</FooterLink></li>
                  <li><FooterLink to="/posts">자유게시판</FooterLink></li>
                  <li><FooterLink to="/consultations">온라인상담</FooterLink></li>
                  <li><FooterLink to="/faq">자주 묻는 질문</FooterLink></li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-1 md:gap-8">
               <div>
                <h3 className="text-sm font-semibold text-slate-300 tracking-wider uppercase">예약 및 문의</h3>
                <ul className="mt-4 space-y-4">
                   <li><FooterLink to="/reservation">온라인 예약</FooterLink></li>
                   <li><FooterLink to="/location">오시는 길</FooterLink></li>
                   <li className="text-slate-400">전화: 031-905-7285</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row-reverse sm:items-center sm:justify-between">
          <p className="text-base text-slate-400 text-center">
            &copy; {new Date().getFullYear()} 연세미치과. All rights reserved.
          </p>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row items-center justify-center gap-x-4 gap-y-2">
             <p className="text-xs text-slate-500">
                주소: 경기 고양시 일산동구 일산로 46 | 대표: 박건현
             </p>
             <Link to="/admin" className="text-xs text-slate-500 hover:text-indigo-400 transition-colors">
              관리자 페이지
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
