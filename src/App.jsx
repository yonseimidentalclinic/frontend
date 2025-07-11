import React from 'react';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            연세미치과
          </Link>
          <div className="space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-500">홈</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500">병원소개</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-500">진료안내</Link>
            {/* '온라인 문의' 링크 추가 */}
            <Link to="/contact" className="text-gray-600 hover:text-blue-500">온라인 문의</Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
