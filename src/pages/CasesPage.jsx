// =================================================================
// 사용자용 치료 사례 갤러리 페이지 (CasesPage.jsx)
// 파일 경로: /src/pages/CasesPage.jsx
// 주요 기능:
// 1. 서버에서 치료 사례 목록을 불러와 표시
// 2. 카테고리별로 사례를 필터링하는 기능
// 3. 페이지네이션 기능으로 많은 사례를 효율적으로 보여줌
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination.jsx';

const API_URL = import.meta.env.VITE_API_URL;
const CATEGORIES = ['전체', '임플란트', '치아교정', '심미보철', '잇몸치료'];

const CasesPage = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeCategory = searchParams.get('category') || '전체';

  const fetchData = useCallback(async (page, category) => {
    setIsLoading(true);
    try {
      const params = { page, limit: 9 };
      if (category && category !== '전체') {
        params.category = category;
      }
      const response = await axios.get(`${API_URL}/api/cases`, { params });
      setCases(response.data.items || []);
      setTotalPages(response.data.totalPages || 0);
      setCurrentPage(response.data.currentPage || 1);
    } catch (err) {
      setError('치료 사례를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const categoryFromUrl = searchParams.get('category') || '전체';
    fetchData(pageFromUrl, categoryFromUrl);
  }, [searchParams, fetchData]);

  const handleCategoryClick = (category) => {
    navigate(`/cases?category=${category}&page=1`);
  };

  const handlePageChange = (page) => {
    navigate(`/cases?category=${activeCategory}&page=${page}`);
  };

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">치료 전후 사례</h1>
          <p className="text-gray-500 mt-2">연세미치과의 치료 결과를 직접 확인해보세요.</p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-10">
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full font-semibold text-sm ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-center">로딩 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        {!isLoading && !error && cases.length === 0 && (
          <p className="text-center text-gray-500 py-10">해당 카테고리의 치료 사례가 없습니다.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cases.map(caseItem => (
            <div key={caseItem.id} className="border rounded-lg overflow-hidden shadow-lg group">
              <div className="grid grid-cols-2">
                <img src={caseItem.beforeImageData || 'https://placehold.co/400x400?text=Before'} alt={`치료 전 - ${caseItem.title}`} className="w-full h-48 object-cover" />
                <img src={caseItem.afterImageData || 'https://placehold.co/400x400?text=After'} alt={`치료 후 - ${caseItem.title}`} className="w-full h-48 object-cover" />
              </div>
              <div className="p-4">
                <p className="text-xs text-blue-600 font-semibold">{caseItem.category}</p>
                <h3 className="text-lg font-bold truncate mt-1">{caseItem.title}</h3>
                <p className="text-sm text-gray-600 mt-1 h-10 overflow-hidden">{caseItem.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default CasesPage;
