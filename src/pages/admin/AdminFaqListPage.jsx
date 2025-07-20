// src/pages/admin/AdminFaqListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';

const AdminFaqListPage = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 수정 중인 FAQ의 ID와 데이터를 저장하는 상태
  const [editingFaq, setEditingFaq] = useState(null); 
  const [editingImageFile, setEditingImageFile] = useState(null);
  
  // 새 FAQ 추가 폼의 상태
  const [newFaq, setNewFaq] = useState({ category: '', question: '', answer: '' });
  const [newImageFile, setNewImageFile] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/faqs');
      setFaqs(response.data);
    } catch (err) {
      setError('FAQ 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleNewFaqChange = (e) => {
    const { name, value } = e.target;
    setNewFaq({ ...newFaq, [name]: value });
  };
  
  const handleEditingFaqChange = (e) => {
    const { name, value } = e.target;
    setEditingFaq({ ...editingFaq, [name]: value });
  };

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!newFaq.category || !newFaq.question || !newFaq.answer) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('category', newFaq.category);
    formData.append('question', newFaq.question);
    formData.append('answer', newFaq.answer);
    if (newImageFile) {
      formData.append('image', newImageFile);
    }

    try {
      await api.post('/admin/faqs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setNewFaq({ category: '', question: '', answer: '' });
      setNewImageFile(null);
      setIsAdding(false);
      fetchFaqs(); // 목록 새로고침
      alert('새로운 FAQ가 추가되었습니다.');
    } catch (err) {
      alert('FAQ 추가에 실패했습니다.');
    }
  };

  const handleUpdate = async (id) => {
    const formData = new FormData();
    formData.append('category', editingFaq.category);
    formData.append('question', editingFaq.question);
    formData.append('answer', editingFaq.answer);
    if (editingImageFile) {
      formData.append('image', editingImageFile);
    } else {
      formData.append('existingImageData', editingFaq.imageData || '');
    }

    try {
      await api.put(`/admin/faqs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setEditingFaq(null);
      setEditingImageFile(null);
      fetchFaqs(); // 목록 새로고침
      alert('FAQ가 성공적으로 수정되었습니다.');
    } catch (err) {
      alert('FAQ 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] FAQ를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/faqs/${id}`);
        fetchFaqs(); // 목록 새로고침
        alert('FAQ가 삭제되었습니다.');
      } catch (err) {
        alert('FAQ 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">FAQ 관리</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <PlusCircle size={20} /> 새 FAQ 추가
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleAddNew} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">새 FAQ 항목</h2>
          <div className="space-y-4">
            <input type="text" name="category" value={newFaq.category} onChange={handleNewFaqChange} placeholder="카테고리 (예: 임플란트)" className="w-full p-2 border rounded" />
            <input type="text" name="question" value={newFaq.question} onChange={handleNewFaqChange} placeholder="질문" className="w-full p-2 border rounded" />
            <textarea name="answer" value={newFaq.answer} onChange={handleNewFaqChange} placeholder="답변" rows="4" className="w-full p-2 border rounded"></textarea>
            <div>
              <label className="block text-sm font-medium text-gray-700">이미지 (선택)</label>
              <input type="file" onChange={(e) => setNewImageFile(e.target.files[0])} className="mt-1 w-full text-sm" />
            </div>
          </div>
          <div className="flex gap-4 mt-4">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
              <Save size={20} /> 저장
            </button>
            <button type="button" onClick={() => setIsAdding(false)} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600">
              <XCircle size={20} /> 취소
            </button>
          </div>
        </form>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-4">
          {faqs.map((faq) => (
            <li key={faq.id} className="border p-4 rounded-lg">
              {editingFaq && editingFaq.id === faq.id ? (
                // 수정 모드
                <div className="space-y-2">
                  <input type="text" name="category" value={editingFaq.category} onChange={handleEditingFaqChange} className="w-full p-2 border rounded" />
                  <input type="text" name="question" value={editingFaq.question} onChange={handleEditingFaqChange} className="w-full p-2 border rounded" />
                  <textarea name="answer" value={editingFaq.answer} onChange={handleEditingFaqChange} rows="3" className="w-full p-2 border rounded"></textarea>
                  <div>
                    <label className="block text-sm font-medium">이미지</label>
                    <input type="file" onChange={(e) => setEditingImageFile(e.target.files[0])} className="mt-1 w-full text-sm" />
                    {editingFaq.imageData && !editingImageFile && <img src={editingFaq.imageData} alt="current" className="mt-2 max-h-32 rounded border"/>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdate(faq.id)} className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">저장</button>
                    <button onClick={() => setEditingFaq(null)} className="text-sm bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600">취소</button>
                  </div>
                </div>
              ) : (
                // 일반 모드
                <div>
                  <p className="text-sm text-gray-500 font-semibold">{faq.category}</p>
                  <p className="font-bold my-1">{faq.question}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{faq.answer}</p>
                  {faq.imageData && <img src={faq.imageData} alt="faq image" className="mt-2 max-h-48 rounded border" />}
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setEditingFaq({ ...faq })} className="text-sm bg-yellow-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-yellow-600">
                      <Edit size={14} /> 수정
                    </button>
                    <button onClick={() => handleDelete(faq.id)} className="text-sm bg-red-500 text-white px-3 py-1 rounded flex items-center gap-1 hover:bg-red-600">
                      <Trash2 size={14} /> 삭제
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default AdminFaqListPage;
