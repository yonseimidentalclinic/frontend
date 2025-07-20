// src/pages/CasesPage.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
// --- 핵심 추가: 애니메이션 라이브러리를 불러옵니다. ---
import { motion } from 'framer-motion';

// 애니메이션 효과를 위한 설정
const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeCategory = searchParams.get('category') || '';

  useEffect(() => {
    const fetchCases = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const category = searchParams.get('category') || '';
        const response = await api.get('/cases', { params: { page, category } });
        setCases(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('치료사례를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, [searchParams]);
  
  // 예시 카테고리 (실제로는 DB에서 가져오는 것이 이상적입니다)
  const categories = ['임플란트', '치아미백', '라미네이트', '잇몸성형'];

  const handleCategoryClick = (category) => {
    setSearchParams({ category: category, page: 1 });
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <motion.div {...fadeInAnimation} className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">치료사례</h2>
          <p className="mt-4 text-lg text-gray-600">연세미치과의 전문성을 결과로 확인하세요.</p>
        </motion.div>

        {/* 카테고리 필터 */}
        <motion.div {...fadeInAnimation} className="mt-10 flex justify-center flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick('')}
            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
              activeCategory === '' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* 치료사례 그리드 */}
        <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="flex">
                <div className="w-1/2">
                  <img src={caseItem.beforeImageData} alt={`Before - ${caseItem.title}`} className="h-48 w-full object-cover"/>
                  <p className="text-center py-1 bg-gray-200 text-sm font-semibold">Before</p>
                </div>
                <div className="w-1/2">
                  <img src={caseItem.afterImageData} alt={`After - ${caseItem.title}`} className="h-48 w-full object-cover"/>
                  <p className="text-center py-1 bg-indigo-200 text-sm font-semibold text-indigo-800">After</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-indigo-600 font-semibold">{caseItem.category}</p>
                <h3 className="mt-1 text-lg font-semibold text-gray-900">{caseItem.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{caseItem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {cases.length === 0 && !loading && (
          <motion.p {...fadeInAnimation} className="text-center text-gray-500 mt-16">
            해당 카테고리의 치료사례가 없습니다.
          </motion.p>
        )}

        <div className="mt-16">
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </div>
      </div>
    </div>
  );
};

export default CasesPage;
