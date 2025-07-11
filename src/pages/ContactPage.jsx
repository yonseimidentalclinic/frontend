// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Vercel에 설정할 백엔드 API 주소를 사용
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/contact`;
    try {
      const response = await axios.post(apiUrl, formData);
      setResponseMsg(response.data.message);
    } catch (error) {
      setResponseMsg('오류가 발생했습니다: ' + error.response.data.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">온라인 문의</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="이름" onChange={handleChange} className="w-full p-2 border rounded" required />
        <input type="email" name="email" placeholder="이메일" onChange={handleChange} className="w-full p-2 border rounded" required />
        <textarea name="message" placeholder="문의 내용" rows="5" onChange={handleChange} className="w-full p-2 border rounded" required />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">제출</button>
      </form>
      {responseMsg && <p className="mt-4">{responseMsg}</p>}
    </div>
  );
}

export default ContactPage;