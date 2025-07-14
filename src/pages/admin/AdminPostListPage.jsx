// =================================================================
// 프론트엔드 안정화 코드: 관리자 자유게시판 관리 목록 페이지
// 파일 경로: /src/pages/admin/AdminPostsListPage.jsx
// 주요 개선사항:
// 1. 로딩, 데이터, 오류 상태를 분리하여 안정성 강화
// 2. 데이터가 없을 경우 "작성된 게시글이 없습니다" 메시지 표시
// 3. 관리자 권한으로 게시글 삭제 기능 및 목록 자동 새로고침
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// API 기본 URL 환경변수에서 가져오기
const API_URL = import.meta.env.VITE_API_URL;

const AdminPostsListPage = () => {
  // 1. 상태 관리: 데이터(posts), 로딩(loading), 오류(error)
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 날짜 포맷팅 함수
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString('ko-KR', options);
  };

  // 2. 데이터 fetching 함수
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // 관리자용 API가 아닌, 공개된 게시글 목록 API를 사용합니다.
      const response = await axios.get(`${API_URL}/api/posts`);
      const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (err) {
      console.error("게시글 목록을 불러오는 중 오류가 발생했습니다:", err);
      setError("데이터를 불러오는 데 실패했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // 3. 삭제 처리 함수
  const handleDelete = async (id) => {
    if (window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/posts/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("성공적으로 삭제되었습니다.");
        fetchPosts(); // 삭제 후 목록 새로고침
      } catch (err) {
        console.error("게시글 삭제 중 오류 발생:", err);
        alert("삭제에 실패했습니다. 다시 시도해 주세요.");
      }
    }
  };

  // 4. 조건부 렌더링 로직
  const renderContent = () => {
    if (loading) {
      return <div className="text-center py-10">로딩 중...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">{error}</div>;
    }
    if (posts.length === 0) {
      return <div className="text-center py-10">작성된 게시글이 없습니다.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">ID</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">제목</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">작성자</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">작성일</th>
              <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">관리</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{post.id}</td>
                <td className="py-3 px-4">{post.title}</td>
                <td className="py-3 px-4">{post.author}</td>
                <td className="py-3 px-4 text-sm">{formatDate(post.createdAt)}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
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

export default AdminPostsListPage;
