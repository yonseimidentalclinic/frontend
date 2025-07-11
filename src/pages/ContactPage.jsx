import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResponseMsg('');
    
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/contact`;

    try {
      const response = await axios.post(apiUrl, formData);
      setResponseMsg(response.data.message);
    } catch (error) {
      const errorMessage = error.response?.data?.message || '문의 제출 중 오류가 발생했습니다.';
      setResponseMsg(`실패: ${errorMessage}`);
    }
  };

  return (
    <>
      <Helmet>
        <title>온라인 문의 | 연세미치과</title>
        <meta name="description" content="연세미치과에 궁금한 점이 있으신가요? 온라인으로 간편하게 문의를 남겨주시면 친절하고 신속하게 답변해드리겠습니다." />
      </Helmet>
      <div>
        {/* ... (이전과 동일한 페이지 내용) ... */}
        <h1 className="text-2xl font-bold mb-4">온라인 문의</h1>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
            <input
              type="text" name="name" id="name" placeholder="성함을 입력해주세요" required
              onChange={handleChange} value={formData.name}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
            <input
              type="email" name="email" id="email" placeholder="답변받으실 이메일을 입력해주세요" required
              onChange={handleChange} value={formData.email}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">문의 내용</label>
            <textarea
              name="message" id="message" placeholder="문의하실 내용을 자세히 적어주세요" required rows="5"
              onChange={handleChange} value={formData.message}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            제출하기
          </button>
        </form>
        {responseMsg && <p className="mt-4 text-center font-semibold">{responseMsg}</p>}
      </div>
    </>
  );
}

export default ContactPage;
