import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/posts/${id}`;
        const response = await axios.get(apiUrl);
        setPost(response.data);
      } catch (err) {
        setError('해당 게시글을 찾을 수 없습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!post) return null;

  return (
    <>
      <Helmet>
        <title>{post.title} | 연세미치과 자유게시판</title>
        <meta name="description" content={post.content.substring(0, 150)} />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">{post.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 my-4 border-b pb-4">
          <span>작성자: {post.author}</span>
          <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
        </div>
        <div className="prose max-w-none min-h-[200px]" dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        <div className="mt-10 pt-6 border-t text-center">
          <Link to="/posts" className="inline-block bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition duration-300">
            목록으로
          </Link>
        </div>
      </div>
    </>
  );
}

export default PostDetailPage;
