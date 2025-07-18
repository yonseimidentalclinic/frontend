// =================================================================
// 사용자용 치료 후기 페이지 (ReviewsPage.jsx)
// 파일 경로: /src/pages/ReviewsPage.jsx
// 주요 기능:
// 1. 서버에서 '승인된' 후기 목록만 불러와서 표시
// 2. 별점, 후기 내용, 관리자 답글 등을 깔끔한 UI로 보여줌
// 3. 후기 작성 페이지로 이동하는 버튼 제공
// =================================================================

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Pagination from '../components/Pagination.jsx';
import { Star, MessageSquare } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    
    const fetchReviews = async (page) => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_URL}/api/reviews`, { params: { page, limit: 5 } });
        if (response.data && Array.isArray(response.data.items)) {
          setReviews(response.data.items);
          setTotalPages(response.data.totalPages);
          setCurrentPage(response.data.currentPage);
        } else {
          setReviews([]);
          setTotalPages(0);
        }
      } catch (err) {
        setError("후기를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews(pageFromUrl);
  }, [searchParams]);

  const handlePageChange = (page) => {
    navigate(`/reviews?page=${page}`);
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR');

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">치료 후기</h1>
          <p className="text-gray-500 mt-2">환자분들께서 직접 남겨주신 소중한 후기입니다.</p>
        </div>
        
        <div className="text-right mb-6">
          <Link to="/reviews/write" className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-700">
            후기 작성하기
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="space-y-8 p-8">
            {loading && <p className="text-center">로딩 중...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && reviews.length === 0 && (
              <p className="text-center text-gray-500 py-10">아직 작성된 후기가 없습니다.</p>
            )}
            {reviews.map(review => (
              <div key={review.id} className="border-b pb-8 last:border-b-0">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xl text-gray-800">{review.patientName}님</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-6 h-6 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{formatDate(review.createdAt)}</p>
                <p className="text-gray-700 mt-4 text-lg whitespace-pre-wrap">{review.content}</p>
                
                {review.adminReply && (
                  <div className="mt-6 bg-blue-50 p-4 rounded-md border-l-4 border-blue-400">
                    <p className="font-semibold text-blue-800 flex items-center"><MessageSquare className="w-5 h-5 mr-2"/>원장님 답글</p>
                    <p className="text-blue-700 mt-2 whitespace-pre-wrap">{review.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10">
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

export default ReviewsPage;
