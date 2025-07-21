// src/pages/NoticeListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const search = searchParams.get('search') || '';
        
        const response = await api.get('/notices', {
          params: { page, search }
        });
        
        setNotices(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: 1 });
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInAnimation} className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">병원소식</h1>
      
      <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목 또는 내용으로 검색"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {notices && notices.length > 0 ? (
            notices.map((notice, index) => (
              <motion.li 
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50"
              >
                <Link to={`/notices/${notice.id}`} className="block">
                  {/* --- 핵심 수정: 작은 화면에서 날짜가 제목 아래로 내려가도록 수정 --- */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <p className="text-lg font-semibold text-gray-800 truncate">{notice.title}</p>
                    <span className="text-sm text-gray-500 mt-1 sm:mt-0">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </Link>
              </motion.li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              {searchParams.get('search') ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
            </li>
          )}
        </ul>
      </div>
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </motion.div>
  );
};

export default NoticeListPage;
