// src/pages/ConsultationEditPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Editor from '../components/Editor'; // Editor 컴포넌트 import

const ConsultationEditPage = () => {
  const [consultation, setConsultation] = useState({ title: '' });
  const [content, setContent] = useState(''); // Editor 상태 분리
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const response = await api.get(`/consultations/${id}`);
        setConsultation({ title: response.data.title });
        setContent(response.data.content);
      } catch (error) {
        alert('상담글 정보를 불러오는 데 실패했습니다.');
        navigate('/consultations');
      }
    };
    fetchConsultation();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setConsultation(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = window.prompt('수정을 완료하려면 비밀번호를 입력하세요.');
    if (!password) return;

    try {
      await api.put(`/consultations/${id}`, { ...consultation, content, password });
      alert('상담글이 성공적으로 수정되었습니다.');
      navigate(`/consultations/${id}`);
    } catch (error) {
      alert('상담글 수정에 실패했습니다. 비밀번호를 확인해주세요.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">온라인상담 글수정</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-md rounded-lg">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">제목</label>
          <input
            type="text"
            name="title"
            id="title"
            value={consultation.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">내용</label>
          {/* --- 핵심 수정: textarea를 Editor 컴포넌트로 교체했습니다. --- */}
          <div className="mt-1">
            <Editor value={content} onChange={setContent} />
          </div>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(`/consultations/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            수정 완료
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConsultationEditPage;
