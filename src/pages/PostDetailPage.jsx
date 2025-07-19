// src/pages/PostDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';

const PostDetailPage = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/posts/${id}`);
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

  // --- 핵심 추가: 수정 시 비밀번호 확인 기능 ---
  const handleEdit = async () => {
    const password = window.prompt('게시글을 수정하려면 비밀번호를 입력하세요.');
    if (password === null) return;
    if (!password) {
      alert('비밀번호를 입력해야 합니다.');
      return;
    }

    try {
      const response = await api.post(`/posts/${id}/verify`, { password });
      if (response.data.success) {
        navigate(`/posts/edit/${id}`);
      } else {
        alert('비밀번호가 올바르지 않습니다.');
      }
    } catch (err) {
      alert('확인 중 오류가 발생했습니다. 다시 시도해주세요.');
      console.error(err);
    }
  };

  // --- 핵심 추가: 게시글 삭제 기능 ---
  const handleDelete = async () => {
    const password = window.prompt('게시글을 삭제하려면 비밀번호를 입력하세요.');
    if (password === null) return;
    if (!password) {
      alert('비밀번호를 입력해야 합니다.');
      return;
    }

    try {
      await api.delete(`/posts/${id}`, {
        data: { password }
      });
      alert('게시글이 성공적으로 삭제되었습니다.');
      navigate('/posts');
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert('비밀번호가 올바르지 않습니다.');
      } else {
        alert('게시글 삭제에 실패했습니다.');
      }
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!post) return <div className="text-center py-20">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-slate-800">{post.title}</h1>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-slate-500">작성자: {post.author}</p>
              <p className="text-sm text-slate-500">
                작성일: {new Date(post.createdAt).toLocaleDateString('ko-KR')}
              </p>
            </div>
          </div>
          <div
            className="p-8 prose max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
        <div className="mt-8 flex justify-between items-center">
          <Link 
            to="/posts" 
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            목록으로
          </Link>
          <div className="flex space-x-4">
            {/* --- 핵심 수정: Link를 button으로 변경하고 onClick 이벤트를 연결합니다. --- */}
            <button 
              onClick={handleEdit}
              className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Edit className="mr-2 h-4 w-4" /> 수정
            </button>
            <button 
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="mr-2 h-4 w-4" /> 삭제
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
