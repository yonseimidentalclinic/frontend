import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Pagination from '../components/Pagination'; // 페이지네이션 컴포넌트 재사용

function PostListPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearch = searchParams.get('search') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/posts?page=${currentPage}&search=${currentSearch}`;
        const response = await axios.get(apiUrl);
        setPosts(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Failed to fetch posts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [currentPage, currentSearch]);

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber, search: currentSearch });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: 1, search: searchTerm });
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;

  return (
    <>
      <Helmet>
        <title>자유게시판 | 연세미치과</title>
        <meta name="description" content="연세미치과 자유게시판입니다. 치아 건강에 대한 궁금증이나 다양한 의견을 자유롭게 나눠보세요." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">자유게시판</h1>
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="제목, 내용, 작성자로 검색"
              className="px-3 py-2 border rounded w-full"
            />
            <button type="submit" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700 flex-shrink-0">검색</button>
          </form>
        </div>
        <div className="flex justify-end mb-4">
            <Link to="/posts/write" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
                새 글 작성하기
            </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {posts.length > 0 ? (
              posts.map((post) => (
                <li key={post.id} className="border-b last:border-b-0">
                  <Link to={`/posts/${post.id}`} className="block p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold text-gray-700 truncate">{post.title}</p>
                      <div className="text-right ml-4 flex-shrink-0">
                        <p className="text-sm text-gray-600">{post.author}</p>
                        <p className="text-xs text-gray-400">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">등록된 게시글이 없습니다.</li>
            )}
          </ul>
        </div>
        {pagination && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </>
  );
}

export default PostListPage;
