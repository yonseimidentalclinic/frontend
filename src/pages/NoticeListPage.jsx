// =================================================================
// 프론트엔드 병원소식 목록 페이지 (NoticeListPage.jsx)
// 최종 업데이트: 2025년 7월 18일
// 주요 개선사항:
// 1. 카테고리 필터 버튼 UI 추가
// 2. 선택된 카테고리에 따라 게시물 목록을 필터링하는 기능 구현
// =================================================================

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination.jsx';
import { Search } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const NOTICE_CATEGORIES = ['전체', '병원소식', '의료상식', '이벤트'];

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const activeCategory = searchParams.get('category') || '전체';

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const searchFromUrl = searchParams.get('search') || '';
    const categoryFromUrl = searchParams.get('category') || '';
    
    const fetchNotices = async (page, search, category) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/notices`, { 
          params: { page, limit: 10, search, category } 
        });
        
        if (response.data && Array.isArray(response.data.items)) {
          setNotices(response.data.items);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
          setTotalItems(response.data.totalItems);
        } else {
          setNotices([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError("목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotices(pageFromUrl, searchFromUrl, categoryFromUrl);
  }, [searchParams]);

  const handlePageChange = (page) => {
    const currentSearch = searchParams.get('search') || '';
    const currentCategory = searchParams.get('category') || '';
    navigate(`/news?page=${page}&search=${currentSearch}&category=${currentCategory}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const currentCategory = searchParams.get('category') || '';
    navigate(`/news?page=1&search=${searchTerm}&category=${currentCategory}`);
  };

  const handleCategoryClick = (category) => {
    const currentSearch = searchParams.get('search') || '';
    navigate(`/news?page=1&search=${currentSearch}&category=${category}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-20 text-gray-500">목록을 불러오는 중입니다...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (notices.length === 0) {
      if (searchParams.get('search') || (searchParams.get('category') && searchParams.get('category') !== '전체')) {
        return <div className="text-center py-20 text-gray-500">조건에 맞는 게시물이 없습니다.</div>;
      }
      return <div className="text-center py-20 text-gray-500">등록된 공지사항이 없습니다.</div>;
    }
    
    return (
      <div className="border-t-2 border-b-2 border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="hidden sm:table-header-group">
            <tr className="border-b">
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-20">번호</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-28">카테고리</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-32">작성일</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {notices.map((notice, index) => (
              <tr key={notice.id} className="border-b border-gray-200 last:border-b-0">
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-500">
                  {totalItems - (currentPage - 1) * 10 - index}
                </td>
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-blue-600 font-semibold">
                  {notice.category}
                </td>
                <td className="py-4 px-2 sm:px-4">
                  <Link to={`/news/${notice.id}`} className="hover:underline text-gray-800">
                    {notice.title}
                  </Link>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{formatDate(notice.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">병원소식</h1>
        <p className="text-gray-500 mt-2">연세미치과의 새로운 소식을 전해드립니다.</p>
      </div>

      {/* [핵심 추가] 카테고리 필터 */}
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {NOTICE_CATEGORIES.map(category => (
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

      <div className="mb-8 max-w-lg mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 내용으로 검색"
            className="flex-grow px-4 py-2 border rounded-md"
          />
          <button type="submit" className="bg-gray-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-700 flex items-center">
            <Search className="w-4 h-4 mr-2" />
            검색
          </button>
        </form>
      </div>

      {renderContent()}
      <div className="mt-8">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default NoticeListPage;
