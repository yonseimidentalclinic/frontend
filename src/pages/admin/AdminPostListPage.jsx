// src/pages/admin/AdminPostListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { Edit, Trash2 } from 'lucide-react';

const AdminPostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      // 관리자 페이지에서는 모든 글을 가져오기 위해 public API를 사용합니다.
      const response = await api.get('/posts', { params: { limit: 1000 } }); // 모든 글을 가져오기 위해 limit 증가
      // --- 핵심 수정: API 응답 구조 변경에 따라 .items를 추가합니다. ---
      setPosts(response.data.items);
    } catch (err) {
      setError('게시글 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] 게시글을 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/posts/${id}`);
        fetchPosts();
        alert('게시글이 삭제되었습니다.');
      } catch (err) {
        alert('게시글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">자유게시판 관리</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">{post.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{post.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{post.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => navigate(`/admin/posts/edit/${post.id}`)} className="text-indigo-600 hover:text-indigo-900"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(post.id)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPostListPage;
