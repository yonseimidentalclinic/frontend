// =================================================================
// 프론트엔드 관리자 대시보드 페이지 (AdminDashboardPage.jsx)
// 파일 경로: /src/pages/admin/AdminDashboardPage.jsx
// =================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Megaphone, Newspaper, MessageSquare } from 'lucide-react';

const AdminDashboardPage = () => {
  const stats = [
    { name: '공지사항 관리', href: '/admin/notices', icon: Megaphone },
    { name: '자유게시판 관리', href: '/admin/posts', icon: Newspaper },
    { name: '온라인상담 관리', href: '/admin/consultations', icon: MessageSquare },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">관리자 대시보드</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex items-center"
            >
              <div className="bg-blue-100 p-4 rounded-full">
                <item.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{item.name}</p>
                <p className="text-gray-500">바로가기 &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">환영합니다!</h2>
          <p className="text-gray-600">
            이곳에서 홈페이지의 주요 콘텐츠를 관리할 수 있습니다. <br />
            왼쪽 메뉴를 통해 공지사항, 자유게시판, 온라인 상담 내역을 확인하고 관리해주세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
