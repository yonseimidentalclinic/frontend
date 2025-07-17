// =================================================================
// 사용자용 게시글 비밀번호 확인 페이지 (PostVerifyPage.jsx)
// 파일 경로: /src/pages/PostVerifyPage.jsx
// 주요 기능:
// 1. 수정/삭제 작업을 수행하기 전, 사용자에게 비밀번호 입력을 요구
// 2. 비밀번호가 일치하면 다음 작업(수정 페이지 이동 또는 삭제 실행)으로 진행
// =================================================================

import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const PostVerifyPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const action = searchParams.get('action'); // 'edit' 또는 'delete'
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // 1. 먼저 비밀번호가 맞는지 서버에 확인
      const verifyResponse = await axios.post(`${API_URL}/api/posts/${id}/verify`, { password });

      if (verifyResponse.data.success) {
        // 2. 비밀번호가 맞으면, 원래 하려던 작업을 실행
        if (action === 'edit') {
          // 수정 페이지로 이동하면서, 확인된 비밀번호를 함께 넘겨줌
          navigate(`/community/posts/${id}/edit`, { state: { password } });
        } else if (action === 'delete') {
          if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
            // 삭제 API 호출 시, 본문에 비밀번호를 포함하여 전송
            await axios.delete(`${API_URL}/api/posts/${id}`, { data: { password } });
            alert('게시글이 삭제되었습니다.');
            navigate('/community/posts');
          }
        }
      } else {
        setError('비밀번호가 일치하지 않습니다.');
      }
    } catch (err) {
      setError('오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const pageTitle = action === 'edit' ? '게시글 수정' : '게시글 삭제';

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">{pageTitle}</h1>
        <p className="text-center text-gray-600 mb-6">
          게시글을 관리하려면 작성 시 입력하신 비밀번호를 입력해주세요.
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

export default PostVerifyPage;
