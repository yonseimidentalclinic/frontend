// src/pages/ConsultationListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Lock, CheckSquare, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const ConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const search = searchParams.get('search') || '';

        const response = await api.get('/consultations', {
          params: { page, search }
        });
        
        setConsultations(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('상담글을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: 1 });
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInAnimation} className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">온라인상담</h1>
        <Link to="/consultations/write" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          상담하기
        </Link>
      </div>

      <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목, 내용 또는 작성자로 검색"
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {consultations && consultations.length > 0 ? (
            consultations.map((item, index) => (
              <motion.li 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="p-4 hover:bg-gray-50"
              >
                <Link to={`/consultations/${item.id}`} className="block">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    {item.isSecret && <Lock size={16} className="text-gray-500" />}
                    <span className="truncate">{item.title}</span>
                  </div>
                  {/* --- 핵심 수정: 작은 화면에서 작성자/날짜/답변상태가 제목 아래로 내려가도록 수정 --- */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                    <span className="text-sm text-gray-600">{item.author}</span>
                    <div className="flex items-center gap-4 mt-1 sm:mt-0">
                      {item.isAnswered && (
                        <span className="flex items-center text-sm text-blue-600 font-semibold">
                          <CheckSquare size={14} className="mr-1" /> 답변완료
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">
              {searchParams.get('search') ? '검색 결과가 없습니다.' : '등록된 상담글이 없습니다.'}
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

export default ConsultationListPage;
