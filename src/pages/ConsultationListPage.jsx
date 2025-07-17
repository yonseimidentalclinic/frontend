// =================================================================
// 프론트엔드 온라인 상담 목록 페이지 (ConsultationListPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 검색창 UI 추가 및 검색 기능 구현 (비밀글은 검색에서 제외)
// 2. 페이지네이션과 검색 기능이 함께 작동하도록 수정
// =================================================================

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, Search } from 'lucide-react';
import Pagination from '../components/Pagination.jsx';

const API_URL = import.meta.env.VITE_API_URL;

const ConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const searchFromUrl = searchParams.get('search') || '';
    
    const fetchConsultations = async (page, search) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/consultations`, { 
          params: { page, limit: 10, search } 
        });
        
        if (response.data && Array.isArray(response.data.items)) {
          setConsultations(response.data.items);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
          setTotalItems(response.data.totalItems);
        } else {
          setConsultations([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError("상담 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations(pageFromUrl, searchFromUrl);
  }, [searchParams]);

  const handlePageChange = (page) => {
    const currentSearch = searchParams.get('search') || '';
    navigate(`/consultation?page=${page}&search=${currentSearch}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/consultation?page=1&search=${searchTerm}`);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-20 text-gray-500">상담 목록을 불러오는 중입니다...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
    if (consultations.length === 0) {
      if (searchParams.get('search')) {
        return <div className="text-center py-20 text-gray-500">"{searchParams.get('search')}"에 대한 검색 결과가 없습니다.</div>;
      }
      return <div className="text-center py-20 text-gray-500">접수된 상담이 없습니다.</div>;
    }
    
    return (
      <div className="border-t-2 border-b-2 border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="hidden md:table-header-group">
            <tr className="border-b">
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-20">번호</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-24">답변상태</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-28">작성자</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600 w-32">작성일</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {consultations.map((item, index) => {
              const linkTo = item.isSecret ? `/consultation/${item.id}/verify` : `/consultation/${item.id}`;
              return (
                <tr key={item.id} className="border-b border-gray-200 last:border-b-0">
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-500">
                    {totalItems - (currentPage - 1) * 10 - index}
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-center">
                    {item.isAnswered ? <span className="text-blue-600 font-semibold text-sm">답변완료</span> : <span className="text-gray-500 text-sm">답변대기</span>}
                  </td>
                  <td className="py-4 px-2 sm:px-4">
                    <Link to={linkTo} className="hover:underline flex items-center">
                      {item.title}
                      {item.isSecret && <Lock className="w-4 h-4 ml-2 text-gray-400 flex-shrink-0" />}
                    </Link>
                  </td>
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{item.author}</td>
                  <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{formatDate(item.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">온라인 상담</h1>
        <p className="text-gray-500 mt-2">궁금한 점을 문의하시면 친절하게 답변해 드립니다.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full sm:w-auto sm:flex-grow max-w-lg">
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제목, 내용, 작성자로 검색"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="bg-gray-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-gray-700 flex items-center"
            >
              <Search className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">검색</span>
            </button>
          </form>
        </div>
        <Link 
          to="/consultation/write"
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 w-full sm:w-auto text-center"
        >
          상담하기
        </Link>
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

export default ConsultationListPage;
