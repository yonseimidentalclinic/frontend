import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white mt-16">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 병원 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">연세미치과</h3>
            <p className="text-gray-400">
              환자의 미소를 최우선으로 생각하며,
              <br />
              정직하고 편안한 진료를 약속합니다.
            </p>
          </div>

          {/* 주요 링크 */}
          <div>
            <h3 className="text-lg font-bold mb-4">바로가기</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">병원소개</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white">진료안내</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">온라인 문의</Link></li>
            </ul>
          </div>

          {/* 연락처 정보 */}
          <div>
            <h3 className="text-lg font-bold mb-4">오시는 길 & 연락처</h3>
            <p className="text-gray-400">주소: 경기도 고양시 일산서구 주엽로 150</p>
            <p className="text-gray-400">전화: 031-123-4567</p>
            <p className="text-gray-400 mt-2">월-금: 09:30 - 18:30</p>
            <p className="text-gray-400">토요일: 09:30 - 14:00 (점심시간 없음)</p>
            <p className="text-gray-400">일요일/공휴일 휴진</p>
          </div>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-10 pt-8 border-t border-gray-700 text-center text-gray-500">
          <p>&copy; {currentYear} 연세미치과. All Rights Reserved.</p>
          <p className="text-sm mt-2">본 사이트의 모든 컨텐츠는 저작권법의 보호를 받으며, 무단 전재 및 재배포를 금지합니다.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
