// =================================================================
// 관리자 후기 관리 페이지 (AdminReviewsPage.jsx)
// 파일 경로: /src/pages/admin/AdminReviewsPage.jsx
// 주요 기능:
// 1. 모든 사용자 후기(승인/비승인) 목록을 불러와서 표시
// 2. 각 후기의 승인 상태를 변경(토글)하는 기능
// 3. 각 후기에 대한 관리자 답글을 작성하고 수정하는 기능
// 4. 불필요한 후기를 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Star, ThumbsUp, MessageSquare, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyInputs, setReplyInputs] = useState({});

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/admin/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('후기 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleApprovalToggle = async (reviewId, currentStatus) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/api/admin/reviews/${reviewId}/approve`, 
        { isApproved: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchReviews(); // 목록 새로고침
    } catch (err) {
      alert('승인 상태 변경에 실패했습니다.');
    }
  };

  const handleReplySubmit = async (reviewId) => {
    const reply = replyInputs[reviewId] || '';
    if (!reply.trim()) {
      alert('답글 내용을 입력해주세요.');
      return;
    }
    const token = localStorage.getItem('accessToken');
    try {
      await axios.post(`${API_URL}/api/admin/reviews/${reviewId}/reply`, 
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('답글이 등록되었습니다.');
      setReplyInputs(prev => ({ ...prev, [reviewId]: '' }));
      fetchReviews();
    } catch (err) {
      alert('답글 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('정말로 이 후기를 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/reviews/${reviewId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('후기가 삭제되었습니다.');
        fetchReviews();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR');

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">치료 후기 관리</h1>
        <div className="bg-white rounded-lg shadow-md">
          <div className="space-y-6 p-6">
            {reviews.length === 0 && <p className="text-center text-gray-500 py-10">작성된 후기가 없습니다.</p>}
            {reviews.map(review => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-lg">{review.patientName}</span>
                    <span className="text-sm text-gray-500 ml-2">{formatDate(review.createdAt)}</span>
                    <div className="flex items-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprovalToggle(review.id, review.isApproved)}
                      className={`px-3 py-1 text-sm rounded-full flex items-center ${review.isApproved ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <ThumbsUp className="mr-1 w-4 h-4" /> {review.isApproved ? '승인됨' : '미승인'}
                    </button>
                    <button onClick={() => handleDelete(review.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{review.content}</p>
                
                {review.adminReply && (
                  <div className="mt-3 bg-blue-50 p-3 rounded-md">
                    <p className="font-semibold text-blue-800">원장님 답글:</p>
                    <p className="text-blue-700 whitespace-pre-wrap">{review.adminReply}</p>
                  </div>
                )}

                <div className="mt-4">
                  <div className="flex gap-2">
                    <textarea
                      value={replyInputs[review.id] || ''}
                      onChange={(e) => setReplyInputs(prev => ({ ...prev, [review.id]: e.target.value }))}
                      placeholder={review.adminReply ? "답글 수정..." : "답글 작성..."}
                      rows="2"
                      className="flex-grow p-2 border rounded-md"
                    />
                    <button onClick={() => handleReplySubmit(review.id)} className="bg-blue-600 text-white px-4 rounded-md self-start py-2">
                      등록
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReviewsPage;
