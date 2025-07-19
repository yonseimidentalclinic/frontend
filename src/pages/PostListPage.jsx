// src/pages/PostListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Search } from 'lucide-react';

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 검색 기능 추가 ---
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const search = searchParams.get('search') || '';

        const response = await api.get('/posts', {
          params: { page, search }
        });
        
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
  
  // 검색 실행 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search: searchInput, page: 1 });
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">자유게시판</h1>
        <Link to="/posts/write" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          글쓰기
        </Link>
      </div>

      {/* 검색창 UI */}
      <form onSubmit={handleSearch} className="mb-8 max-w-lg mx-auto">
        <div className="relative">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="제목, 내용 또는 작성자로 검색"
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
      </form>

      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {posts && posts.length > 0 ? (
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
            <li className="p-4 text-center text-gray-500">
              {searchParams.get('search') ? '검색 결과가 없습니다.' : '등록된 게시글이 없습니다.'}
            </li>
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
