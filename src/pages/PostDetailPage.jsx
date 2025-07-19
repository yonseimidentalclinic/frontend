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
          <div className="p-8 prose max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
          {/* 댓글 기능이 있다면 여기에 표시됩니다. */}
        </div>
        <div className="mt-8 flex justify-between items-center">
          {/* --- 핵심 수정: 목록으로 돌아가는 링크 주소를 올바르게 수정했습니다. --- */}
          <Link 
            to="/posts" 
            className="inline-flex items-center px-6 py-3 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700 transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            목록으로
          </Link>
          <div className="flex space-x-4">
            <Link to={`/posts/edit/${id}`} className="inline-flex items-center px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors">
              <Edit className="mr-2 h-4 w-4" /> 수정
            </Link>
            {/* 삭제 버튼은 비밀번호 확인 로직이 필요하여 우선 비활성화 */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
