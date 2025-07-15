// =================================================================
// 프론트엔드 자유게시판 목록 페이지 (PostListPage.jsx)
// 최종 업데이트: 2025년 7월 15일
// 주요 개선사항:
// 1. 서버에서 비정상적인 데이터가 와도 앱이 멈추지 않도록 안정성 강화
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      // [핵심 수정] 서버에서 받은 데이터가 배열(목록) 형태일 때만 상태를 업데이트합니다.
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        console.error("API did not return an array for posts:", response.data);
        setPosts([]);
      }
    } catch (err) {
      console.error("게시글 목록을 불러오는 중 오류가 발생했습니다:", err);
      setError("게시판을 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-20 text-gray-500">게시글을 불러오는 중입니다...</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>;
    }
    if (posts.length === 0) {
      return <div className="text-center py-20 text-gray-500">작성된 게시글이 없습니다.</div>;
    }
    return (
      <div className="border-t-2 border-b-2 border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="sr-only">
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {posts.map((post, index) => (
              <tr key={post.id} className="border-b border-gray-200 last:border-b-0">
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-500">{posts.length - index}</td>
                <td className="py-4 px-2 sm:px-4">
                  <Link to={`/community/posts/${post.id}`} className="hover:underline text-gray-800">
                    {post.title}
                  </Link>
                </td>
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{post.author}</td>
                <td className="py-4 px-2 sm:px-4 text-center text-sm text-gray-600">{formatDate(post.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">자유게시판</h1>
        <p className="text-gray-500 mt-2">환자분들의 자유로운 소통 공간입니다.</p>
      </div>
      
      <div className="mb-6 flex justify-end">
        <Link 
          to="/community/posts/write"
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          글쓰기
        </Link>
      </div>

      {renderContent()}
    </div>
  );
};

export default PostListPage;
