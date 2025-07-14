// =================================================================
// 프론트엔드 온라인상담 비밀번호 확인 페이지 (ConsultationVerifyPage.jsx)
// 파일 경로: /src/pages/ConsultationVerifyPage.jsx
// =================================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ConsultationVerifyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/api/consultations/${id}/verify`, { password });
      if (response.data.success) {
        // 비밀번호가 맞으면 상세 페이지로 이동
        navigate(`/consultation/${id}`);
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">비밀글 확인</h1>
        <p className="text-center text-gray-600 mb-6">
          이 글은 비밀글입니다. 작성 시 입력하신 비밀번호를 입력해주세요.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="sr-only">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="비밀번호"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? '확인 중...' : '확인'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConsultationVerifyPage;
