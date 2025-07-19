// src/pages/PostListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const response = await api.get('/posts', {
          params: { page }
        });

        // --- [디버깅 코드] ---
        // 서버로부터 받은 데이터를 브라우저 개발자 도구 콘솔에 출력합니다.
        console.log('자유게시판 서버로부터 받은 실제 데이터:', response.data); 
        
        // 핵심 수정: response.data에서 items 배열을 가져와 상태를 설정합니다.
        setPosts(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [searchParams]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">자유게시판</h1>
        <Link to="/posts/write" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          글쓰기
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {posts && posts.length > 0 ? ( // posts가 null이 아닌지 확인
            posts.map((post) => (
              <li key={post.id} className="p-4 hover:bg-gray-50">
                <Link to={`/posts/${post.id}`} className="block">
                  <p className="text-lg font-semibold text-gray-800 truncate">{post.title}</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{post.author}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">등록된 게시글이 없습니다.</li>
          )}
        </ul>
      </div>
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default PostListPage;
