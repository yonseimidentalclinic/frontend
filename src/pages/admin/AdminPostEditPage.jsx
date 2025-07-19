// src/pages/admin/AdminPostEditPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Editor from '../../components/Editor';
import { Trash2 } from 'lucide-react';

const AdminPostEditPage = () => {
  const [post, setPost] = useState(null);
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPostAndComments = useCallback(async () => {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost({ title: response.data.title });
      setContent(response.data.content);
      setComments(response.data.comments || []);
    } catch (error) {
      alert('게시글 정보를 불러오는 데 실패했습니다.');
      navigate('/admin/posts');
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/posts/${id}`, { ...post, content });
      alert('게시글이 성공적으로 수정되었습니다.');
      navigate('/admin/posts');
    } catch (error) {
      alert('게시글 수정에 실패했습니다.');
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm(`[ID: ${commentId}] 댓글을 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/posts/comments/${commentId}`);
        alert('댓글이 삭제되었습니다.');
        fetchPostAndComments(); // 댓글 목록 새로고침
      } catch (error) {
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (!post) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">자유게시판 글 수정 및 댓글 관리</h1>
      
      {/* 글 수정 폼 */}
      <form onSubmit={handleSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6 mb-8">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            name="title"
            id="title"
            value={post.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">내용</label>
          <div className="mt-1">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
            글 내용 저장
          </button>
        </div>
      </form>

      {/* 댓글 관리 섹션 */}
      <div className="bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4">댓글 관리</h2>
        <div className="space-y-4">
          {comments.length > 0 ? comments.map(comment => (
            <div key={comment.id} className="border p-4 rounded-md flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.author}</p>
                <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString('ko-KR')}</p>
                <p className="mt-2" dangerouslySetInnerHTML={{ __html: comment.content }} />
              </div>
              <button onClick={() => handleCommentDelete(comment.id)} className="text-red-500 hover:text-red-700 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          )) : <p className="text-gray-500">이 게시글에는 댓글이 없습니다.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPostEditPage;
