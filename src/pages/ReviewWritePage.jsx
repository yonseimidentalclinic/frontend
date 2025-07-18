// =================================================================
// 사용자용 후기 작성 페이지 (ReviewWritePage.jsx)
// 파일 경로: /src/pages/ReviewWritePage.jsx
// 주요 기능:
// 1. 이름, 별점, 후기 내용을 입력하는 폼 제공
// 2. 별점을 클릭하여 선택하는 인터랙티브 UI 구현
// 3. 작성된 후기를 서버로 전송
// =================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ReviewWritePage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    rating: 0,
    content: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patientName, rating, content } = formData;
    if (!patientName || rating === 0 || !content) {
      alert('이름, 별점, 후기 내용을 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/reviews`, formData);
      alert('소중한 후기를 남겨주셔서 감사합니다. 관리자 승인 후 게시됩니다.');
      navigate('/reviews');
    } catch (err) {
      alert('후기 등록에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">치료 후기 작성</h1>
          <p className="text-gray-500 mt-2">
            환자분의 소중한 경험이 다른 분들께 큰 도움이 됩니다.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="patientName" className="block text-lg font-semibold text-gray-700 mb-2">작성자</label>
              <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-2">만족도</label>
              <div className="flex items-center">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <button
                      type="button"
                      key={ratingValue}
                      onClick={() => setFormData(prev => ({ ...prev, rating: ratingValue }))}
                      onMouseEnter={() => setHoverRating(ratingValue)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-colors ${
                          ratingValue <= (hoverRating || formData.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label htmlFor="content" className="block text-lg font-semibold text-gray-700 mb-2">후기 내용</label>
              <textarea name="content" id="content" value={formData.content} onChange={handleInputChange} rows="8" placeholder="치료 과정이나 결과에 대한 솔직한 후기를 남겨주세요." className="w-full p-3 border rounded-md" required></textarea>
            </div>
            <div className="text-center">
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? '등록 중...' : '후기 등록하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewWritePage;
