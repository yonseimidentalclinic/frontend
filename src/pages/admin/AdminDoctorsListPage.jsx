// =================================================================
// 관리자 의료진 관리 페이지 (AdminDoctorsListPage.jsx)
// 파일 경로: /src/pages/admin/AdminDoctorsListPage.jsx
// 주요 기능:
// 1. 의료진 목록을 불러와서 표시
// 2. 새 의료진 정보를 입력하고 추가하는 폼 제공
// 3. 기존 의료진 정보를 수정하고 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDoctorsListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 폼 상태 관리
  const [formState, setFormState] = useState({
    id: null,
    name: '',
    position: '',
    history: '',
    imageUrl: '',
  });

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/doctors`);
      setDoctors(response.data);
    } catch (err) {
      setError('의료진 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState({ id: null, name: '', position: '', history: '', imageUrl: '' });
  };

  const handleEditClick = (doctor) => {
    setFormState({
      id: doctor.id,
      name: doctor.name,
      position: doctor.position,
      history: doctor.history,
      imageUrl: doctor.imageUrl,
    });
    window.scrollTo(0, 0); // 수정 시 화면 상단으로 이동
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, position, history, imageUrl } = formState;
    if (!name || !position) {
      alert('이름과 직책은 필수 항목입니다.');
      return;
    }

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    const data = { name, position, history, imageUrl };

    try {
      if (id) {
        // 수정
        await axios.put(`${API_URL}/api/admin/doctors/${id}`, data, { headers });
        alert('성공적으로 수정되었습니다.');
      } else {
        // 추가
        await axios.post(`${API_URL}/api/admin/doctors`, data, { headers });
        alert('새로운 의료진이 추가되었습니다.');
      }
      resetForm();
      fetchDoctors();
    } catch (err) {
      alert('작업에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 정보를 삭제하시겠습니까?')) {
      try {
        const token = localStorage.getItem('accessToken');
        await axios.delete(`${API_URL}/api/admin/doctors/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('성공적으로 삭제되었습니다.');
        fetchDoctors();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">의료진 관리</h1>

        {/* 추가/수정 폼 */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            {formState.id ? <Edit className="mr-2" /> : <Plus className="mr-2" />}
            {formState.id ? '의료진 정보 수정' : '새 의료진 추가'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formState.name} onChange={handleInputChange} placeholder="이름 (예: 홍길동)" className="w-full p-2 border rounded" />
              <input name="position" value={formState.position} onChange={handleInputChange} placeholder="직책 (예: 대표원장)" className="w-full p-2 border rounded" />
            </div>
            <input name="imageUrl" value={formState.imageUrl} onChange={handleInputChange} placeholder="사진 이미지 URL" className="w-full p-2 border rounded" />
            <textarea name="history" value={formState.history} onChange={handleInputChange} placeholder="주요 이력 (한 줄에 하나씩 입력)" rows="4" className="w-full p-2 border rounded"></textarea>
            <div className="flex justify-end gap-4">
              {formState.id && <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded-md flex items-center"><X className="mr-1 w-4 h-4" />수정 취소</button>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <Plus className="mr-1 w-4 h-4" />{formState.id ? '정보 저장' : '추가하기'}
              </button>
            </div>
          </form>
        </div>

        {/* 의료진 목록 */}
        <div className="bg-white rounded-lg shadow-md">
          {isLoading && <p className="p-4 text-center">로딩 중...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="border rounded-lg p-4 flex flex-col">
                <img src={doctor.imageUrl || 'https://placehold.co/300x300?text=No+Image'} alt={doctor.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="text-blue-600 mb-2">{doctor.position}</p>
                <div className="text-sm text-gray-600 flex-grow whitespace-pre-wrap">
                  {doctor.history}
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEditClick(doctor)} className="bg-green-500 text-white px-3 py-1 text-sm rounded flex items-center"><Edit className="mr-1 w-3 h-3" />수정</button>
                  <button onClick={() => handleDelete(doctor.id)} className="bg-red-500 text-white px-3 py-1 text-sm rounded flex items-center"><Trash2 className="mr-1 w-3 h-3" />삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDoctorsListPage;
