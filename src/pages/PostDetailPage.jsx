// =================================================================
// 프론트엔드 자유게시판 상세 페이지 (PostDetailPage.jsx)
// 최종 업데이트: 2025년 7월 17일
// 주요 개선사항:
// 1. 댓글에 '좋아요' 버튼과 '태그' 추가 기능 구현
// 2. 각 댓글에 달린 좋아요 수와 태그 목록을 표시
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { MessageSquare, Trash2, ThumbsUp, Tag } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

// [핵심 추가] 댓글 컴포넌트들 (좋아요, 태그 기능 추가)
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
      onCommentAdded();
    } catch (err) {
      alert('댓글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
        <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="이름" className="w-full px-3 py-2 border rounded-md" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호" className="w-full px-3 py-2 border rounded-md" required />
      </div>
      <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="댓글을 입력하세요..." rows="3" className="w-full px-3 py-2 border rounded-md mb-2" required></textarea>
      <div className="text-right">
        <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-5 py-2 rounded-md font-semibold hover:bg-blue-700 disabled:bg-blue-300">
          {isSubmitting ? '등록 중...' : '댓글 등록'}
        </button>
      </div>
    </form>
  );
};

const CommentList = ({ comments, onCommentAction }) => {
  const [tagInput, setTagInput] = useState({});

  const formatDate = (dateString) => new Date(dateString).toLocaleString('ko-KR');

  const handleLike = async (commentId) => {
    try {
      await axios.post(`${API_URL}/api/posts/comments/${commentId}/like`);
      onCommentAction(); // 부모 컴포넌트에 변경 알림
    } catch (err) {
      alert('좋아요 처리에 실패했습니다.');
    }
  };

  const handleAddTag = async (e, commentId) => {
    e.preventDefault();
    const tag = tagInput[commentId];
    if (!tag || !tag.trim()) {
      alert('태그를 입력해주세요.');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/posts/comments/${commentId}/tags`, { tag });
      setTagInput(prev => ({ ...prev, [commentId]: '' }));
      onCommentAction();
    } catch (err) {
      alert('태그 추가에 실패했습니다.');
    }
  };

  const handleDelete = async (commentId) => {
    const password = prompt('댓글 삭제를 위해 비밀번호를 입력하세요.');
    if (password) {
      try {
        await axios.delete(`${API_URL}/api/posts/comments/${commentId}`, { data: { password } });
        alert('댓글이 삭제되었습니다.');
        onCommentAction();
      } catch (err) {
        alert(err.response?.data || '삭제에 실패했습니다. 비밀번호를 확인해주세요.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {comments.map(comment => (
        <div key={comment.id} className="border-b pb-6">
          <div className="flex justify-between items-start">
            <p className="font-semibold text-lg">{comment.author}</p>
            <p className="text-sm text-gray-500">{formatDate(comment.createdAt)}</p>
          </div>
          <p className="text-gray-700 my-2 whitespace-pre-wrap">{comment.content}</p>
          
          {/* 좋아요, 태그, 삭제 버튼 영역 */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-4">
              <button onClick={() => handleLike(comment.id)} className="flex items-center gap-1 text-gray-500 hover:text-blue-600">
                <ThumbsUp className="w-4 h-4" />
                <span>좋아요 {comment.likes || 0}</span>
              </button>
              <form onSubmit={(e) => handleAddTag(e, comment.id)} className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="태그 추가"
                  value={tagInput[comment.id] || ''}
                  onChange={(e) => setTagInput(prev => ({ ...prev, [comment.id]: e.target.value }))}
                  className="px-2 py-1 border rounded-md text-sm w-24"
                />
                <button type="submit" className="p-1 text-gray-400 hover:text-blue-600"><Tag className="w-4 h-4"/></button>
              </form>
            </div>
            <button onClick={() => handleDelete(comment.id)} className="text-gray-400 hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* 태그 표시 영역 */}
          {comment.tags && (
            <div className="flex flex-wrap gap-2 mt-3">
              {comment.tags.split(',').map((tag, index) => (
                <span key={index} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
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
    try {
      // 댓글 추가/삭제 시에는 로딩 상태를 표시하지 않아 깜빡임을 줄임
      if (!post) setLoading(true); 
      const response = await axios.get(`${API_URL}/api/posts/${id}`);
      setPost(response.data);
    } catch (err) {
      setError('게시글을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [id, post]);

  useEffect(() => {
    fetchPostAndComments();
  }, [id]); // id가 바뀔 때만 처음 로딩

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
        
        <div className="border-t pt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2" /> 댓글 ({post.comments?.length || 0})
          </h2>
          <CommentForm postId={id} onCommentAdded={fetchPostAndComments} />
          <div className="mt-6">
            <CommentList comments={post.comments || []} onCommentAction={fetchPostAndComments} />
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
