// src/pages/ReviewsPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Star, MessageSquare, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const fadeInAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const response = await api.get('/reviews', { params: { page, limit: 5 } });
        setReviews(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('후기를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [searchParams]);

  const handlePageChange = (page) => {
    navigate(`/reviews?page=${page}`);
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <motion.div initial="initial" animate="animate" variants={fadeInAnimation} className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">치료 후기</h1>
          <p className="mt-4 text-lg text-gray-600">
            환자분들이 직접 남겨주신 소중한 경험을 확인해보세요.
          </p>
        </div>
        <div className="text-center my-8">
          <Link
            to="/reviews/write"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700"
          >
            <PlusCircle size={20} />
            후기 작성하기
          </Link>
        </div>
        <div className="space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-lg text-gray-800">{review.patientName} 님</p>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-1">{new Date(review.createdAt).toLocaleDateString('ko-KR')}</p>
                <p className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap">{review.content}</p>
                {review.imageData && (
                  <div className="mt-4">
                    <img src={review.imageData} alt="치료 후기 사진" className="max-w-sm h-auto rounded-lg" />
                  </div>
                )}
                {review.adminReply && (
                  <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                    <p className="font-semibold text-sm text-indigo-800 flex items-center gap-2">
                      <MessageSquare size={16} /> 연세미치과 답변
                    </p>
                    <p className="mt-2 text-sm text-gray-700">{review.adminReply}</p>
                  </div>
                )}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">아직 등록된 후기가 없습니다.</p>
            </div>
          )}
        </div>
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewsPage;
