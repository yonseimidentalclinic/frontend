// src/pages/admin/AdminReviewListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2, Save } from 'lucide-react';

const AdminReviewListPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reviews');
      setReviews(response.data);
    } catch (err) {
      setError('후기 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleToggleApproval = async (id, currentStatus) => {
    try {
      await api.put(`/admin/reviews/${id}/approve`, { isApproved: !currentStatus });
      fetchReviews();
    } catch (err) {
      alert('승인 상태 변경에 실패했습니다.');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyingTo) return;
    try {
      await api.post(`/admin/reviews/${replyingTo}/reply`, { reply: replyContent });
      setReplyingTo(null);
      setReplyContent('');
      fetchReviews();
      alert('답글이 성공적으로 등록되었습니다.');
    } catch (err) {
      alert('답글 등록에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] 후기를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/reviews/${id}`);
        fetchReviews();
        alert('후기가 삭제되었습니다.');
      } catch (err) {
        alert('후기 삭제에 실패했습니다.');
      }
    }
  };

  const startReplying = (review) => {
    setReplyingTo(review.id);
    setReplyContent(review.adminReply || '');
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">후기 관리</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className={`p-4 rounded-lg ${review.isApproved ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{review.patientName}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleString('ko-KR')} | 별점: {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </p>
                </div>
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${review.isApproved ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                  {review.isApproved ? '승인됨' : '대기중'}
                </span>
              </div>
              <p className="mt-2 text-gray-800">{review.content}</p>
              
              {review.adminReply && (
                <div className="mt-3 p-3 bg-gray-100 rounded">
                  <p className="font-semibold text-sm text-blue-800">병원 답글:</p>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.adminReply}</p>
                </div>
              )}

              {replyingTo === review.id ? (
                <form onSubmit={handleReplySubmit} className="mt-4">
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    className="w-full p-2 border rounded"
                    rows="3"
                    placeholder="답글을 입력하세요..."
                  ></textarea>
                  <div className="flex gap-2 mt-2">
                    <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1 hover:bg-blue-700">
                      <Save size={14} /> 저장
                    </button>
                    <button type="button" onClick={() => setReplyingTo(null)} className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600">
                      취소
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex gap-2 mt-4">
                  <button onClick={() => handleToggleApproval(review.id, review.isApproved)} className={`text-sm px-3 py-1 rounded flex items-center gap-1 text-white ${review.isApproved ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-green-500 hover:bg-green-600'}`}>
                    {review.isApproved ? <ThumbsDown size={14} /> : <ThumbsUp size={14} />}
                    {review.isApproved ? '승인 취소' : '승인'}
                  </button>
                  <button onClick={() => startReplying(review)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-600">
                    <MessageSquare size={14} /> {review.adminReply ? '답글 수정' : '답글 달기'}
                  </button>
                  <button onClick={() => handleDelete(review.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600">
                    <Trash2 size={14} /> 삭제
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminReviewListPage;
