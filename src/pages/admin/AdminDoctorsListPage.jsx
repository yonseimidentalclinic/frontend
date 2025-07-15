// =================================================================
// 관리자 의료진 관리 페이지 (AdminDoctorsListPage.jsx) - 최종 완성본
// 최종 업데이트: 2025년 7월 15일
// 주요 개선사항:
// 1. FileReader의 결과값을 가장 안정적인 event.target.result로 받아오도록 수정하여 타이밍 오류 원천 차단
// 2. 불필요한 진단용 코드를 모두 제거
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Upload } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDoctorsListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const initialFormState = { id: null, name: '', position: '', history: '', imageData: '' };
  const [formState, setFormState] = useState(initialFormState);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/doctors`);
      setDoctors(Array.isArray(response.data) ? response.data : []);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // [핵심 수정] 파일 읽기가 성공적으로 완료되면, event 객체를 통해 결과에 접근합니다.
    // 이것이 가장 표준적이고 안정적인 방법입니다.
    reader.onload = (event) => {
      try {
        const imageData = event.target?.result;
        if (typeof imageData === 'string' && imageData.length > 0) {
          setFormState(prev => ({ ...prev, imageData: imageData }));
        } else {
          alert('이미지를 처리하는 중 오류가 발생했습니다. 다른 파일을 선택해 주세요.');
        }
      } catch (error) {
        console.error("Error inside FileReader onload:", error);
        alert('이미지 처리 중 예기치 않은 오류가 발생했습니다.');
      }
    };

    reader.onerror = () => {
      alert('이미지 파일을 읽는 중 오류가 발생했습니다.');
    };

    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  const handleEditClick = (doctor) => {
    setFormState({
      id: doctor.id,
      name: doctor.name,
      position: doctor.position,
      history: doctor.history,
      imageData: doctor.imageData,
    });
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, name, position, history, imageData } = formState;
    if (!name || !position) return alert('이름과 직책은 필수 항목입니다.');

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    const data = { name, position, history, imageData };
    const action = id ? '수정' : '추가';
    const url = id ? `${API_URL}/api/admin/doctors/${id}` : `${API_URL}/api/admin/doctors`;
    const method = id ? 'put' : 'post';
    
    try {
      await axios({ method, url, data, headers });
      alert(`성공적으로 ${action}되었습니다.`);
      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(`${action} 실패:`, err);
      alert('작업에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('정말로 이 정보를 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      const url = `${API_URL}/api/admin/doctors/${doctorId}`;
      try {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        alert('성공적으로 삭제되었습니다.');
        fetchDoctors();
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">의료진 관리</h1>
        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold mb-4">{formState.id ? '정보 수정' : '새 의료진 추가'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="name" value={formState.name} onChange={handleInputChange} placeholder="이름" className="w-full p-2 border rounded" />
              <input name="position" value={formState.position} onChange={handleInputChange} placeholder="직책" className="w-full p-2 border rounded" />
            </div>
            <div className="flex items-center gap-4">
              <label htmlFor="imageUpload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                사진 선택
              </label>
              <input id="imageUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {formState.imageData && <img src={formState.imageData} alt="미리보기" className="w-20 h-20 object-cover rounded" />}
            </div>
            <textarea name="history" value={formState.history} onChange={handleInputChange} placeholder="주요 이력 (한 줄에 하나씩)" rows="4" className="w-full p-2 border rounded"></textarea>
            <div className="flex justify-end gap-4">
              {formState.id && <button type="button" onClick={resetForm} className="bg-gray-300 px-4 py-2 rounded-md">취소</button>}
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md">{formState.id ? '저장' : '추가'}</button>
            </div>
          </form>
        </div>
        <div className="bg-white rounded-lg shadow-md">
          {isLoading && <p className="p-4 text-center">로딩 중...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {doctors.map(doctor => (
              <div key={doctor.id} className="border rounded-lg p-4 flex flex-col">
                <img src={doctor.imageData || 'https://placehold.co/300x300?text=No+Image'} alt={doctor.name} className="w-full h-48 object-cover rounded-md mb-4" />
                <h3 className="text-xl font-bold">{doctor.name}</h3>
                <p className="text-blue-600 mb-2">{doctor.position}</p>
                <div className="text-sm text-gray-600 flex-grow whitespace-pre-wrap">{doctor.history}</div>
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
