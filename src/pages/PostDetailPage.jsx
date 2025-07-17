// =================================================================
// 프론트엔드 자유게시판 상세 페이지 (PostDetailPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 게시글 하단에 댓글 목록과 댓글 작성 폼을 추가
// 2. 사용자가 댓글을 작성하고, 비밀번호로 직접 삭제하는 기능 구현
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// [핵심 추가] 댓글 컴포넌트들
const CommentForm = ({ postId, onCommentAdded }) => {
  const [author, setAuthor] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!author.trim() || !password.trim() || !content.trim()) {
      alert('이름, 비밀번호, 내용을 모두 입력해주세요.');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/posts/${postId}/comments`, { author, password, content });
      alert('댓글이 성공적으로 등록되었습니다.');
      setAuthor('');
      setPassword('');
      setContent('');
      onCommentAdded(); // 댓글 목록 새로고침 콜백 호출
    } catch (err) {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="이름"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-3 py-2 border rounded-md"
          required
        />
      </div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요..."
        rows="3"
        className="w-full px-3 py-2 border rounded-md mb-2"
        required
      ></textarea>
      <div className="text-right">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
};

const CommentList = ({ comments, onCommentDeleted }) => {
  const formatDate = (dateString) => new Date(dateString).toLocaleString('ko-KR');

  const handleDelete = async (commentId) => {
    const password = prompt('댓글 삭제를 위해 비밀번호를 입력하세요.');
    if (password) {
      try {
        await axios.delete(`${API_URL}/api/posts/comments/${commentId}`, { data: { password } });
        alert('댓글이 삭제되었습니다.');
        onCommentDeleted(); // 댓글 목록 새로고침 콜백 호출
      } catch (err) {
        alert(err.response?.data || '삭제에 실패했습니다. 비밀번호를 확인해주세요.');
      }
    }
  };

  return (
    <div className="space-y-4">
      {comments.map(comment => (
        <div key={comment.id} className="border-b pb-4">
          <div className="flex justify-between items-center">
            <p className="font-semibold">{comment.author}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
              <button onClick={() => handleDelete(comment.id)} className="text-gray-400 hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-gray-700 mt-1 whitespace-pre-wrap">{comment.content}</p>
        </div>
      ))}
    </div>
  );
};


const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPostAndComments = useCallback(async () => {
    // 댓글 추가/삭제 시에도 로딩 상태를 표시하기 위해 setLoading(true) 호출
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('게시글을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!post) return <div className="text-center p-10">해당 게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mb-6 border-b pb-4 flex justify-between">
          <span>작성자: {post.author}</span>
          <span>작성일: {formatDate(post.createdAt)}</span>
        </div>
        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: post.content }} />
        
        {/* [핵심 추가] 댓글 섹션 */}
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" /> 댓글 ({post.comments?.length || 0})
          </h2>
          <CommentForm postId={id} onCommentAdded={fetchPostAndComments} />
          <div className="mt-6">
            <CommentList comments={post.comments || []} onCommentDeleted={fetchPostAndComments} />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <Link to="/community/posts" className="bg-gray-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-gray-700 transition-colors">
          목록으로
        </Link>
        <div className="flex gap-2">
          <Link to={`/community/posts/${id}/verify?action=edit`} className="bg-blue-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-blue-700">
            수정
          </Link>
          <Link to={`/community/posts/${id}/verify?action=delete`} className="bg-red-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-red-700">
            삭제
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
