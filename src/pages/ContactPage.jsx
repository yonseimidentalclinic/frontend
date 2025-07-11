import React, { useState } from 'react';
import axios from 'axios';

function ContactPage() {
  // 사용자가 입력하는 값을 저장하기 위한 state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  // 백엔드로부터 받은 응답 메시지를 저장하기 위한 state
  const [responseMsg, setResponseMsg] = useState('');

  // 입력 칸에 글자를 쓸 때마다 formData의 값을 업데이트하는 함수
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  // '제출' 버튼을 눌렀을 때 실행되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // form의 기본 동작(페이지 새로고침)을 막습니다.
    setResponseMsg(''); // 이전 응답 메시지를 초기화합니다.

    // Vercel에 설정한 백엔드 API 주소를 가져옵니다.
    const apiUrl = `${import.meta.env.VITE_API_URL}/api/contact`;

    try {
      // axios를 사용해 백엔드로 POST 요청을 보냅니다.
      const response = await axios.post(apiUrl, formData);
      // 성공하면 백엔드가 보낸 메시지를 화면에 보여줍니다.
      setResponseMsg(response.data.message);
    } catch (error) {
      // 실패하면 에러 메시지를 화면에 보여줍니다.
      const errorMessage = error.response?.data?.message || '문의 제출 중 오류가 발생했습니다.';
      setResponseMsg(`실패: ${errorMessage}`);
    }
  };

  return (
    <div>
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
      {/* responseMsg에 내용이 있을 때만 화면에 표시 */}
      {responseMsg && <p className="mt-4 text-center font-semibold">{responseMsg}</p>}
    </div>
  );
}

export default ContactPage;
