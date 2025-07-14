// =================================================================
// 프론트엔드 자유게시판 상세 페이지 (PostDetailPage.jsx)
// 파일 경로: /src/pages/PostDetailPage.jsx
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
      <div className="mt-8 text-center">
        <Link to="/community/posts" className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors">
          목록으로
        </Link>
      </div>
    </div>
  );
};

export default PostDetailPage;
