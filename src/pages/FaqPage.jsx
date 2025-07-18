// =================================================================
// 사용자용 자주 묻는 질문(FAQ) 페이지 (FaqPage.jsx)
// 파일 경로: /src/pages/FaqPage.jsx
// 주요 기능:
// 1. 서버에서 FAQ 목록을 불러와 카테고리별로 그룹화
// 2. 아코디언 형태로 질문을 클릭하면 답변이 펼쳐지는 UI 제공
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronDown } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const FaqItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full py-5 text-left"
      >
        <span className="text-lg font-medium text-gray-900">Q. {faq.question}</span>
        <ChevronDown className={`w-6 h-6 text-gray-400 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pb-5 px-1">
          <p className="text-gray-600 whitespace-pre-wrap">A. {faq.answer}</p>
        </div>
      )}
    </div>
  );
};

const FaqPage = () => {
  const [faqs, setFaqs] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/faqs`);
      const grouped = (response.data || []).reduce((acc, faq) => {
        (acc[faq.category] = acc[faq.category] || []).push(faq);
        return acc;
      }, {});
      setFaqs(grouped);
    } catch (err) {
      setError('FAQ 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">자주 묻는 질문</h1>
          <p className="text-gray-500 mt-2">궁금하신 점을 쉽고 빠르게 확인해보세요.</p>
        </div>

        {isLoading && <p className="text-center">로딩 중...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        <div className="space-y-10">
          {Object.entries(faqs).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-2xl font-bold text-blue-700 mb-4">{category}</h2>
              <div className="bg-white p-6 rounded-lg shadow-md">
                {items.map(faq => <FaqItem key={faq.id} faq={faq} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FaqPage;
