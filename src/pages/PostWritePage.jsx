import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function PostWritePage() {
  const [formData, setFormData] = useState({ author: '', title: '', content: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/posts`;
      const response = await axios.post(apiUrl, formData);
      if (response.data.success) {
        navigate(`/posts/${response.data.postId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || '글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Helmet><title>새 글 작성 | 자유게시판</title></Helmet>
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">자유게시판 글쓰기</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="author" placeholder="작성자" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="title" placeholder="제목" required onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="content" placeholder="내용" required rows="10" onChange={handleChange} className="w-full p-2 border rounded" />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">
            작성 완료
          </button>
        </form>
      </div>
    </>
  );
}

export default PostWritePage;
