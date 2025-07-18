// src/components/MainLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

/**
 * 환자용 페이지의 공통 레이아웃 컴포넌트입니다.
 * 모든 페이지에 헤더와 푸터를 포함시키고,
 * 페이지별 컨텐츠를 <Outlet /> 위치에 렌더링합니다.
 */
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        {/* App.jsx의 자식 라우트들이 이 위치에 렌더링됩니다. */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
