// =================================================================
// 프론트엔드 자유게시판 상세 페이지 (PostDetailPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 게시글 하단에 '수정'과 '삭제' 버튼을 추가
// 2. 각 버튼 클릭 시, 비밀번호 확인 페이지로 이동하도록 링크 설정
// =================================================================

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/posts/${id}`);
        setPost(response.data);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center p-10">해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6 border-b pb-4 flex justify-between">
          <span>작성자: {post.author}</span>
          <span>작성일: {formatDate(post.createdAt)}</span>
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* [핵심 추가] 수정/삭제 버튼 영역 */}
      <div className="mt-8 flex justify-between items-center">
        <Link to="/community/posts" className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors">
          목록으로
        </Link>
        <div className="flex gap-2">
          <Link to={`/community/posts/${id}/verify?action=edit`} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">
            수정
          </Link>
          <Link to={`/community/posts/${id}/verify?action=delete`} className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
            삭제
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
