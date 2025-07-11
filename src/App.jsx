import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx'; // 1. Footer 컴포넌트 import

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            연세미치과
          </Link>
          <div className="space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-500">홈</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500">병원소개</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-500">진료안내</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-500">온라인 문의</Link>
          </div>
        </nav>
      </header>

      {/* flex-grow를 사용해 main 컨텐츠가 남은 공간을 모두 차지하게 만듭니다. */}
      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>

      {/* 2. Footer 컴포넌트를 main 아래에 추가 */}
      <Footer />
    </div>
  );
}

export default App;
