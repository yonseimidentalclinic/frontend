// =================================================================
// 관리자 치료 사례 관리 페이지 (AdminCasePhotosPage.jsx)
// 파일 경로: /src/pages/admin/AdminCasePhotosPage.jsx
// 주요 기능:
// 1. 치료 사례 목록을 불러와서 표시
// 2. 제목, 카테고리, 설명, 전/후 사진을 업로드하는 폼 제공
// 3. 기존 치료 사례를 수정하고 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const AdminCasePhotosPage = () => {
  const [cases, setCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFormState = { id: null, title: '', category: '', description: '' };
  const [formState, setFormState] = useState(initialFormState);

  const [beforeImageFile, setBeforeImageFile] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [preview, setPreview] = useState({ before: '', after: '' });

  const beforeInputRef = useRef(null);
  const afterInputRef = useRef(null);

  const fetchCases = useCallback(async () => {
    setIsLoading(true);
    try {
      // 카테고리 없이 전체 목록을 가져옵니다.
      const response = await axios.get(`${API_URL}/api/cases`, { params: { limit: 999 } });
      setCases(response.data.items || []);
    } catch (err) {
      setError('치료 사례를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCases();
  }, [fetchCases]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      if (type === 'before') {
        setBeforeImageFile(compressedFile);
        setPreview(prev => ({ ...prev, before: URL.createObjectURL(compressedFile) }));
      } else {
        setAfterImageFile(compressedFile);
        setPreview(prev => ({ ...prev, after: URL.createObjectURL(compressedFile) }));
      }
    } catch (error) {
      alert('이미지 압축에 실패했습니다.');
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setBeforeImageFile(null);
    setAfterImageFile(null);
    setPreview({ before: '', after: '' });
    if (beforeInputRef.current) beforeInputRef.current.value = null;
    if (afterInputRef.current) afterInputRef.current.value = null;
  };

  const handleEditClick = (caseItem) => {
    setFormState({
      id: caseItem.id,
      title: caseItem.title,
      category: caseItem.category,
      description: caseItem.description,
    });
    setPreview({ before: caseItem.beforeImageData, after: caseItem.afterImageData });
    setSelectedFile(null);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, title, category, description } = formState;
    if (!title || !category) return alert('제목과 카테고리는 필수 항목입니다.');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('description', description);
    
    if (beforeImageFile) formData.append('beforeImage', beforeImageFile);
    if (afterImageFile) formData.append('afterImage', afterImageFile);
    
    // 수정 시 기존 이미지를 유지하기 위한 로직
    if (id && !beforeImageFile && preview.before) formData.append('existingBeforeImage', preview.before);
    if (id && !afterImageFile && preview.after) formData.append('existingAfterImage', preview.after);

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    
    const action = id ? '수정' : '추가';
    const url = id ? `${API_URL}/api/admin/cases/${id}` : `${API_URL}/api/admin/cases`;
    const method = id ? 'put' : 'post';
    
    try {
      await axios({ method, url, data: formData, headers });
      alert(`성공적으로 ${action}되었습니다.`);
      resetForm();
      fetchCases();
    } catch (err) {
      console.error(`${action} 실패:`, err);
      alert('작업에 실패했습니다.');
    }
  };

  const handleDelete = async (caseId) => {
    if (window.confirm('정말로 이 치료 사례를 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/cases/${caseId}`, { headers: { Authorization: `Bearer ${token}` } });
        alert('삭제되었습니다.');
        fetchCases();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">치료 사례 관리</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">{formState.id ? '사례 수정' : '새 사례 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" value={formState.title} onChange={handleInputChange} placeholder="제목 (예: 앞니 부분 교정)" className="w-full p-2 border rounded" required />
              <input name="category" value={formState.category} onChange={handleInputChange} placeholder="카테고리 (예: 치아교정)" className="w-full p-2 border rounded" required />
            </div>
            <textarea name="description" value={formState.description} onChange={handleInputChange} placeholder="간단한 설명" rows="3" className="w-full p-2 border rounded"></textarea>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold mb-2">치료 전 사진</label>
                <label htmlFor="beforeImageUpload" className="cursor-pointer bg-gray-200 p-2 rounded inline-flex items-center"><Upload className="w-4 h-4 mr-2" /> 파일 선택</label>
                <input ref={beforeInputRef} id="beforeImageUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'before')} className="hidden" />
                {preview.before && <img src={preview.before} alt="치료 전 미리보기" className="w-32 h-32 object-cover rounded mt-2" />}
              </div>
              <div>
                <label className="block font-semibold mb-2">치료 후 사진</label>
                <label htmlFor="afterImageUpload" className="cursor-pointer bg-gray-200 p-2 rounded inline-flex items-center"><Upload className="w-4 h-4 mr-2" /> 파일 선택</label>
                <input ref={afterInputRef} id="afterImageUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'after')} className="hidden" />
                {preview.after && <img src={preview.after} alt="치료 후 미리보기" className="w-32 h-32 object-cover rounded mt-2" />}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              {formState.id && <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded-md">취소</button>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">{formState.id ? '저장' : '추가'}</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">등록된 치료 사례 목록</h2>
          {isLoading && <p className="p-4 text-center">로딩 중...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            {cases.map(caseItem => (
              <div key={caseItem.id} className="border rounded-lg p-4">
                <h3 className="text-xl font-bold">{caseItem.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{caseItem.category}</p>
                <div className="flex gap-4 mb-2">
                  <img src={caseItem.beforeImageData || 'https://placehold.co/300x300?text=Before'} alt="치료 전" className="w-1/2 h-32 object-cover rounded" />
                  <img src={caseItem.afterImageData || 'https://placehold.co/300x300?text=After'} alt="치료 후" className="w-1/2 h-32 object-cover rounded" />
                </div>
                <p className="text-sm text-gray-600">{caseItem.description}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEditClick(caseItem)} className="bg-green-500 text-white px-3 py-1 text-sm rounded flex items-center"><Edit className="mr-1 w-3 h-3" />수정</button>
                  <button onClick={() => handleDelete(caseItem.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded flex items-center"><Trash2 className="mr-1 w-3 h-3" />삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCasePhotosPage;
