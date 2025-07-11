import React, { useState } from 'react'; // 1. useState import
import { Link, Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx';

// 햄버거 메뉴 아이콘 SVG
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

// 닫기 아이콘 SVG
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function App() {
  // 2. 모바일 메뉴가 열렸는지 닫혔는지 기억하기 위한 state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            연세미치과
          </Link>
          
          {/* 3. 데스크탑용 메뉴 (중간 크기 이상의 화면에서만 보임) */}
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-500">홈</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500">병원소개</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-500">진료안내</Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-500">온라인 문의</Link>
          </div>

          {/* 4. 모바일용 햄버거 메뉴 버튼 (중간 크기 미만의 화면에서만 보임) */}
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {/* 5. 모바일 메뉴 (isMenuOpen이 true일 때만 보임) */}
        {isMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">홈</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">병원소개</Link>
            <Link to="/services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">진료안내</Link>
            <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">온라인 문의</Link>
          </div>
        )}
      </header>

      <main className="container mx-auto p-8 flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
