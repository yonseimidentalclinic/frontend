// =================================================================
// 관리자 자유게시판 목록 페이지 (AdminPostListPage.jsx)
// 주요 개선사항:
// 1. 각 게시글마다 '수정' 버튼을 추가
// 2. 수정 버튼 클릭 시, 새로 만든 AdminPostEditPage로 이동
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // Link 대신 useNavigate 사용
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminPostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // useNavigate 훅 사용

  const formatDate = (dateString) => new Date(dateString).toLocaleString('ko-KR');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/api/posts`);
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("성공적으로 삭제되었습니다.");
        fetchPosts();
      } catch (err) {
        alert("삭제에 실패했습니다.");
      }
    }
  };

  const renderContent = () => {
    if (loading) return <div className="text-center py-10">로딩 중...</div>;
    if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
    if (posts.length === 0) return <div className="text-center py-10">작성된 게시글이 없습니다.</div>;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">제목</th>
              <th className="py-3 px-4 text-left">작성자</th>
              <th className="py-3 px-4 text-left">작성일</th>
              <th className="py-3 px-4 text-center">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {posts.map((post) => (
              <tr key={post.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{post.id}</td>
                <td className="py-3 px-4">{post.title}</td>
                <td className="py-3 px-4">{post.author}</td>
                <td className="py-3 px-4 text-sm">{formatDate(post.createdAt)}</td>
                <td className="py-3 px-4 text-center">
                  {/* [핵심 추가] 수정 버튼 */}
                  <button
                    onClick={() => navigate(`/admin/posts/edit/${post.id}`)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 mr-2"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">자유게시판 관리</h1>
        <div className="bg-white rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPostListPage;
