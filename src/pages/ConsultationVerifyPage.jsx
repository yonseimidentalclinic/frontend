// =================================================================
// 사용자용 상담글 비밀번호 확인 페이지 (ConsultationVerifyPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 수정/삭제/열람 등 다양한 작업(action)을 처리하도록 로직 확장
// 2. 비밀번호가 일치하면 다음 작업(수정 페이지 이동 또는 삭제 실행)으로 진행
// =================================================================

import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ConsultationVerifyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action') || 'view'; // 기본값은 'view'
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
        if (action === 'edit') {
          navigate(`/consultation/${id}/edit`, { state: { password } });
        } else if (action === 'delete') {
          if (window.confirm('정말로 이 상담글을 삭제하시겠습니까? 답변이 달린 경우 삭제할 수 없습니다.')) {
            await axios.delete(`${API_URL}/api/consultations/${id}`, { data: { password } });
            alert('상담글이 삭제되었습니다.');
            navigate('/consultation');
          }
        } else { // action === 'view'
          navigate(`/consultation/${id}`);
        }
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError(err.response?.data || '오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitleMap = {
    edit: '상담글 수정',
    delete: '상담글 삭제',
    view: '비밀글 확인',
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{pageTitleMap[action]}</h1>
        <p className="text-center text-gray-600 mb-6">
          작성 시 입력하신 비밀번호를 입력해주세요.
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
