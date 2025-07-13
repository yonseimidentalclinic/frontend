import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import Pagination from '../../components/Pagination';

function AdminPostListPage() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  const token = localStorage.getItem('adminToken');
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const currentSearch = searchParams.get('search') || '';

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/posts?page=${currentPage}&search=${currentSearch}`;
      const response = await axios.get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
      setPosts(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [currentPage, currentSearch]);

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/posts/${id}`;
        await axios.delete(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        alert('삭제되었습니다.');
        fetchPosts();
      } catch (error) {
        alert('삭제에 실패했습니다.');
        console.error("Failed to delete post", error);
      }
    }
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ page: 1, search: searchTerm });
  };

  const handlePageChange = (pageNumber) => {
    setSearchParams({ page: pageNumber, search: currentSearch });
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>자유게시판 관리 | 연세미치과</title></Helmet>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">자유게시판 관리</h1>
        <form onSubmit={handleSearch} className="flex gap-2">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="제목, 내용, 작성자로 검색"
            className="px-3 py-2 border rounded"
          />
          <button type="submit" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700">검색</button>
        </form>
      </div>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {posts.map(post => (
              <tr key={post.id}>
                <td className="px-6 py-4">{post.title}</td>
                <td className="px-6 py-4">{post.author}</td>
                <td className="px-6 py-4">{new Date(post.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900">삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}

export default AdminPostListPage;
