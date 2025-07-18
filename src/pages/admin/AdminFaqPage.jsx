// =================================================================
// 관리자 FAQ 관리 페이지 (AdminFaqPage.jsx)
// 파일 경로: /src/pages/admin/AdminFaqPage.jsx
// 주요 기능:
// 1. FAQ 목록을 불러와서 카테고리별로 그룹화하여 표시
// 2. 새 FAQ를 카테고리, 질문, 답변 형식으로 추가하는 기능
// 3. 기존 FAQ를 수정하고 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const FAQ_CATEGORIES = ['임플란트', '치아교정', '심미보철', '일반진료', '기타'];

const AdminFaqPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFormState = { id: null, category: FAQ_CATEGORIES[0], question: '', answer: '' };
  const [formState, setFormState] = useState(initialFormState);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/faqs`);
      setFaqs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('FAQ 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleEditClick = (faq) => {
    setFormState({
      id: faq.id,
      category: faq.category,
      question: faq.question,
      answer: faq.answer,
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, category, question, answer } = formState;
    if (!category || !question || !answer) {
      alert('카테고리, 질문, 답변은 필수 항목입니다.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    const data = { category, question, answer };

    const action = id ? '수정' : '추가';
    const url = id ? `${API_URL}/api/admin/faqs/${id}` : `${API_URL}/api/admin/faqs`;
    const method = id ? 'put' : 'post';
    
    try {
      await axios({ method, url, data, headers });
      alert(`성공적으로 ${action}되었습니다.`);
      resetForm();
      fetchFaqs();
    } catch (err) {
      alert('작업에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (faqId) => {
    if (window.confirm('정말로 이 FAQ를 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/faqs/${faqId}`, { headers: { Authorization: `Bearer ${token}` } });
        alert('삭제되었습니다.');
        fetchFaqs();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const groupedFaqs = faqs.reduce((acc, faq) => {
    (acc[faq.category] = acc[faq.category] || []).push(faq);
    return acc;
  }, {});

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">자주 묻는 질문(FAQ) 관리</h1>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">{formState.id ? 'FAQ 수정' : '새 FAQ 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block font-semibold mb-1">카테고리</label>
                <select name="category" id="category" value={formState.category} onChange={handleInputChange} className="w-full p-2 border rounded bg-white">
                  {FAQ_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="question" className="block font-semibold mb-1">질문 (Q)</label>
              <textarea name="question" id="question" value={formState.question} onChange={handleInputChange} placeholder="질문 내용을 입력하세요." rows="3" className="w-full p-2 border rounded"></textarea>
            </div>
            <div>
              <label htmlFor="answer" className="block font-semibold mb-1">답변 (A)</label>
              <textarea name="answer" id="answer" value={formState.answer} onChange={handleInputChange} placeholder="답변 내용을 입력하세요." rows="5" className="w-full p-2 border rounded"></textarea>
            </div>
            <div className="flex justify-end gap-4">
              {formState.id && <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded-md flex items-center"><X className="mr-1 w-4 h-4" />수정 취소</button>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <Plus className="mr-1 w-4 h-4" />{formState.id ? '수정 완료' : '추가하기'}
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">등록된 FAQ 목록</h2>
          {isLoading && <p className="p-4 text-center">로딩 중...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          <div className="space-y-6 p-6">
            {Object.entries(groupedFaqs).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xl font-bold text-blue-700 border-b-2 border-blue-200 pb-2 mb-4">{category}</h3>
                <div className="space-y-4">
                  {items.map(faq => (
                    <div key={faq.id} className="border rounded-lg p-4">
                      <p className="font-semibold text-gray-800">Q. {faq.question}</p>
                      <p className="text-gray-600 mt-1 whitespace-pre-wrap">A. {faq.answer}</p>
                      <div className="mt-3 flex gap-2">
                        <button onClick={() => handleEditClick(faq)} className="bg-green-500 text-white px-3 py-1 text-sm rounded flex items-center"><Edit className="mr-1 w-3 h-3" />수정</button>
                        <button onClick={() => handleDelete(faq.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded flex items-center"><Trash2 className="mr-1 w-3 h-3" />삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminFaqPage;
