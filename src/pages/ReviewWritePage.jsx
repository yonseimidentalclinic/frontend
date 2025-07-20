// src/pages/ReviewWritePage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Star } from 'lucide-react';

const StarRating = ({ rating, setRating }) => {
  const [hoverRating, setHoverRating] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <Star
            key={starValue}
            className={`h-8 w-8 cursor-pointer transition-colors ${
              starValue <= (hoverRating || rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
            fill="currentColor"
            onClick={() => setRating(starValue)}
            onMouseEnter={() => setHoverRating(starValue)}
            onMouseLeave={() => setHoverRating(0)}
          />
        );
      })}
    </div>
  );
};

const ReviewWritePage = () => {
  const [formData, setFormData] = useState({ patientName: '', content: '' });
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientName || rating === 0 || !formData.content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    try {
      await api.post('/reviews', { ...formData, rating });
      alert('소중한 후기를 남겨주셔서 감사합니다. 관리자 확인 후 등록됩니다.');
      navigate('/reviews');
    } catch (error) {
      alert('후기 등록에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">치료 후기 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">작성자명</label>
          <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-md"/>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">별점</label>
          <div className="mt-1">
            <StarRating rating={rating} setRating={setRating} />
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">후기 내용</label>
          <textarea name="content" id="content" rows="8" value={formData.content} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        <div className="flex justify-end gap-4">
          <button type="button" onClick={() => navigate('/reviews')} className="px-4 py-2 border rounded-md">취소</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md">등록하기</button>
        </div>
      </form>
    </div>
  );
};

export default ReviewWritePage;
