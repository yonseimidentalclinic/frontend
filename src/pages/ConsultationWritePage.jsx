import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function ConsultationWritePage() {
  const [formData, setFormData] = useState({
    author: '',
    password: '',
    title: '',
    content: '',
    is_secret: false,
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/consultations`;
      const response = await axios.post(apiUrl, formData);
      if (response.data.success) {
        // 글쓰기 성공 시, 상세 페이지로 이동
        navigate(`/consultations/${response.data.consultationId}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || '글 등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <Helmet>
        <title>상담 글쓰기 | 연세미치과</title>
      </Helmet>
      <div className="max-w-2xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">상담 글쓰기</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="author" placeholder="작성자" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="password" name="password" placeholder="비밀번호 (4자리 이상)" required onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="text" name="title" placeholder="제목" required onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="content" placeholder="내용" required rows="10" onChange={handleChange} className="w-full p-2 border rounded" />
          <div className="flex items-center">
            <input type="checkbox" name="is_secret" id="is_secret" onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
            <label htmlFor="is_secret" className="ml-2 block text-sm text-gray-900">비밀글로 설정</label>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700">
            작성 완료
          </button>
        </form>
      </div>
    </>
  );
}

export default ConsultationWritePage;
