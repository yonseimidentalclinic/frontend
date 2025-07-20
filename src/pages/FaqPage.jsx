// src/pages/FaqPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import { Search, ChevronDown, HelpCircle } from 'lucide-react';
// --- 핵심 추가: 애니메이션 라이브러리를 불러옵니다. ---
import { motion } from 'framer-motion';

// 애니메이션 효과를 위한 설정
const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

// 개별 FAQ 아이템을 위한 아코디언 컴포넌트
const AccordionItem = ({ faq, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left py-5 px-6 focus:outline-none"
      >
        <div className="flex items-center">
          <span className="text-lg font-semibold text-indigo-600 mr-4">Q.</span>
          <span className="text-base md:text-lg font-medium text-gray-800">{faq.question}</span>
        </div>
        <ChevronDown
          className={`h-6 w-6 text-gray-500 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}
      >
        <div className="p-6 bg-gray-50 flex">
          <span className="text-lg font-semibold text-gray-500 mr-4">A.</span>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

const FaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [activeCategory, setActiveCategory] = useState('전체');

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get('/faqs', {
          params: { search: searchTerm }
        });
        setFaqs(response.data);
      } catch (err) {
        setError('데이터를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const timerId = setTimeout(() => {
      fetchFaqs();
    }, 300);

    return () => clearTimeout(timerId);
  }, [searchTerm]);

  const groupedFaqs = useMemo(() => {
    return faqs.reduce((acc, faq) => {
      const category = faq.category || '기타';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(faq);
      return acc;
    }, {});
  }, [faqs]);

  const categories = ['전체', ...Object.keys(groupedFaqs)];

  const filteredFaqs = useMemo(() => {
    if (activeCategory === '전체') {
      return groupedFaqs;
    }
    return { [activeCategory]: groupedFaqs[activeCategory] };
  }, [activeCategory, groupedFaqs]);

  const handleAccordionClick = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <motion.div {...fadeInAnimation} className="text-center">
          <HelpCircle className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            자주 묻는 질문
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            연세미치과에 대해 궁금한 점을 찾아보세요.
          </p>
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-10 max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="궁금한 점을 검색해보세요 (예: 임플란트, 스케일링)"
              className="block w-full bg-white border border-gray-300 rounded-full py-4 pl-12 pr-6 text-lg shadow-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-8 flex justify-center flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-12">
          {loading ? (
            <p className="text-center text-gray-500">불러오는 중...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : Object.keys(filteredFaqs).length > 0 ? (
            Object.entries(filteredFaqs).map(([category, faqsInCategory]) => (
              <div key={category} className="mb-10">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 px-6">{category}</h3>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {faqsInCategory && faqsInCategory.map((faq) => (
                    <AccordionItem
                      key={faq.id}
                      faq={faq}
                      isOpen={activeAccordion === faq.id}
                      onClick={() => handleAccordionClick(faq.id)}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 pt-8">검색 결과가 없습니다.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FaqPage;
