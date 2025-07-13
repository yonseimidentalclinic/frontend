import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './components/Footer.jsx';

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-blue-600">
            연세미치과
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-600 hover:text-blue-500">홈</Link>
            <Link to="/about" className="text-gray-600 hover:text-blue-500">병원소개</Link>
            <Link to="/services" className="text-gray-600 hover:text-blue-500">진료안내</Link>
            <Link to="/notices" className="text-gray-600 hover:text-blue-500">병원소식</Link>
            <Link to="/consultations" className="text-gray-600 hover:text-blue-500">온라인 상담</Link>
            <Link to="/posts" className="text-gray-600 hover:text-blue-500">자유게시판</Link>
            <Link to="/location" className="text-gray-600 hover:text-blue-500">오시는 길</Link>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 focus:outline-none">
              {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </nav>

        {isMenuOpen && (
          <div className="md:hidden bg-white px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">홈</Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">병원소개</Link>
            <Link to="/services" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">진료안내</Link>
            <Link to="/notices" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">병원소식</Link>
            <Link to="/consultations" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">온라인 상담</Link>
            <Link to="/posts" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">자유게시판</Link>
            <Link to="/location" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">오시는 길</Link>
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
