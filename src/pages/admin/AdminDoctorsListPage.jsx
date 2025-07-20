// src/pages/admin/AdminDoctorsListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { PlusCircle, Edit, Trash2, Save, XCircle } from 'lucide-react';

const AdminDoctorsListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 수정/추가 폼의 상태
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null); // null이면 '추가', 객체면 '수정'
  const [formData, setFormData] = useState({ name: '', position: '', history: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/doctors');
      setDoctors(response.data);
    } catch (err) {
      setError('의료진 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  // 폼 열기/닫기 핸들러
  const openFormForAdd = () => {
    setEditingDoctor(null);
    setFormData({ name: '', position: '', history: '' });
    setImageFile(null);
    setImagePreview(null);
    setIsFormOpen(true);
  };

  const openFormForEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({ name: doctor.name, position: doctor.position, history: doctor.history });
    setImageFile(null);
    setImagePreview(doctor.imageData);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 폼 제출 핸들러 (추가/수정)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('name', formData.name);
    submissionData.append('position', formData.position);
    submissionData.append('history', formData.history);
    if (imageFile) {
      submissionData.append('image', imageFile);
    } else if (editingDoctor) {
      submissionData.append('existingImageData', editingDoctor.imageData || '');
    }

    try {
      if (editingDoctor) {
        // 수정
        await api.put(`/admin/doctors/${editingDoctor.id}`, submissionData);
        alert('의료진 정보가 수정되었습니다.');
      } else {
        // 추가
        await api.post('/admin/doctors', submissionData);
        alert('새로운 의료진이 추가되었습니다.');
      }
      closeForm();
      fetchDoctors();
    } catch (err) {
      alert('작업에 실패했습니다.');
    }
  };

  // 삭제 핸들러
  const handleDelete = async (id) => {
    if (window.confirm(`이 의료진 정보를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/doctors/${id}`);
        alert('삭제되었습니다.');
        fetchDoctors();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">의료진 관리</h1>
        <button onClick={openFormForAdd} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <PlusCircle size={20} /> 새 의료진 추가
        </button>
      </div>

      {/* 추가/수정 폼 (모달 또는 별도 섹션) */}
      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold">{editingDoctor ? '의료진 정보 수정' : '새 의료진 추가'}</h2>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="이름" required className="w-full p-2 border rounded"/>
            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="직책 (예: 원장)" required className="w-full p-2 border rounded"/>
            <textarea name="history" value={formData.history} onChange={handleChange} placeholder="주요 이력 (한 줄에 하나씩 입력)" rows="5" className="w-full p-2 border rounded"></textarea>
            <div>
              <label className="block text-sm font-medium text-gray-700">사진</label>
              <input type="file" onChange={handleImageChange} accept="image/*" className="mt-1 w-full text-sm"/>
              {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 h-40 w-auto rounded border"/>}
            </div>
            <div className="flex gap-4">
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700">
                <Save size={20} /> {editingDoctor ? '수정 완료' : '추가하기'}
              </button>
              <button type="button" onClick={closeForm} className="bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600">
                <XCircle size={20} /> 취소
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 의료진 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map(doctor => (
          <div key={doctor.id} className="bg-white p-4 rounded-lg shadow-md text-center">
            <img src={doctor.imageData || 'https://placehold.co/400x500?text=No+Image'} alt={doctor.name} className="w-full h-80 object-cover rounded-md mb-4"/>
            <h3 className="text-xl font-bold">{doctor.name}</h3>
            <p className="text-indigo-600">{doctor.position}</p>
            <p className="text-sm text-gray-500 mt-2 whitespace-pre-line">{doctor.history}</p>
            <div className="flex justify-center gap-4 mt-4 border-t pt-4">
              <button onClick={() => openFormForEdit(doctor)} className="text-blue-600 hover:text-blue-800"><Edit /></button>
              <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:text-red-800"><Trash2 /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDoctorsListPage;
