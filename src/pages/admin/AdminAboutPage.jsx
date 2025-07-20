// src/pages/admin/AdminAboutPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import Editor from '../../components/Editor';
import { Upload, Trash2, Image as ImageIcon, Save, Edit, XCircle } from 'lucide-react';

const AdminAboutPage = () => {
  const [about, setAbout] = useState({ title: '', subtitle: '', content: '', imageData: null });
  const [clinicPhotos, setClinicPhotos] = useState([]);
  const [newPhoto, setNewPhoto] = useState({ file: null, caption: '' });
  const [loading, setLoading] = useState(true);

  // 갤러리 사진 캡션 수정을 위한 상태
  const [editingPhotoId, setEditingPhotoId] = useState(null);
  const [editingCaption, setEditingCaption] = useState('');

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [aboutResponse, photosResponse] = await Promise.all([
        api.get('/about'),
        api.get('/admin/clinic-photos')
      ]);
      setAbout(aboutResponse.data);
      setClinicPhotos(photosResponse.data);
    } catch (err) {
      alert('데이터를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAbout(prevState => ({ ...prevState, [name]: value }));
  };
  
  const handleContentChange = (value) => {
    setAbout(prevState => ({ ...prevState, content: value }));
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAbout(prevState => ({ ...prevState, imageData: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveMainImage = () => {
    if (window.confirm('대표 이미지를 삭제하시겠습니까?')) {
      setAbout(prevState => ({ ...prevState, imageData: null }));
    }
  };

  const handleAboutSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/about', about);
      alert('병원소개 정보가 성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장에 실패했습니다.');
    }
  };

  const handleNewPhotoChange = (e) => {
    if (e.target.type === 'file') {
      setNewPhoto(prev => ({...prev, file: e.target.files[0]}));
    } else {
      setNewPhoto(prev => ({...prev, caption: e.target.value}));
    }
  };

  const handlePhotoUpload = async (e) => {
    e.preventDefault();
    if (!newPhoto.file) {
      alert('이미지 파일을 선택해주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('image', newPhoto.file);
    formData.append('caption', newPhoto.caption);

    try {
      await api.post('/admin/clinic-photos', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('사진이 추가되었습니다.');
      setNewPhoto({ file: null, caption: '' });
      e.target.reset();
      fetchAllData();
    } catch (err) {
      alert('사진 추가에 실패했습니다.');
    }
  };
  
  const handlePhotoDelete = async (id) => {
    if (window.confirm(`이 사진을 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/clinic-photos/${id}`);
        alert('사진이 삭제되었습니다.');
        fetchAllData();
      } catch (err) {
        alert('사진 삭제에 실패했습니다.');
      }
    }
  };
  
  const startEditingCaption = (photo) => {
    setEditingPhotoId(photo.id);
    setEditingCaption(photo.caption || '');
  };

  const handleCaptionSave = async (id) => {
    try {
      await api.put(`/admin/clinic-photos/${id}`, { caption: editingCaption });
      alert('캡션이 수정되었습니다.');
      setEditingPhotoId(null);
      fetchAllData();
    } catch (err) {
      alert('캡션 수정에 실패했습니다.');
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;

  return (
    <div className="p-6 md:p-8 space-y-8">
      <form onSubmit={handleAboutSubmit} className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <h1 className="text-3xl font-bold">병원소개 관리</h1>
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목</label>
          <input type="text" name="title" id="title" value={about.title || ''} onChange={handleAboutChange} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
          <input type="text" name="subtitle" id="subtitle" value={about.subtitle || ''} onChange={handleAboutChange} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">대표 이미지</label>
          <input type="file" onChange={handleAboutImageChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          {about.imageData && (
            <div className="mt-4 relative w-fit">
              <img src={about.imageData} alt="Preview" className="max-h-48 rounded-md border"/>
              <button type="button" onClick={handleRemoveMainImage} className="absolute -top-2 -right-2 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                <XCircle size={18}/>
              </button>
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">본문 내용</label>
          <Editor value={about.content || ''} onChange={handleContentChange} />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2">
            <Save size={18} /> 병원소개 저장
          </button>
        </div>
      </form>

      <div className="bg-white p-8 shadow-md rounded-lg space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-3"><ImageIcon /> 병원 둘러보기 이미지 관리</h2>
        <form onSubmit={handlePhotoUpload} className="flex flex-col sm:flex-row gap-4 border p-4 rounded-md">
          <input type="file" onChange={handleNewPhotoChange} required className="flex-grow text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
          <input type="text" value={newPhoto.caption} onChange={handleNewPhotoChange} placeholder="사진 설명 (예: 진료실)" className="p-2 border rounded-md" />
          <button type="submit" className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Upload size={18} /> 추가
          </button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {clinicPhotos.map(photo => (
            <div key={photo.id} className="border rounded-lg overflow-hidden flex flex-col">
              <div className="relative group">
                <img src={photo.imageData} alt={photo.caption || '병원 사진'} className="w-full h-40 object-cover" />
                <button onClick={() => handlePhotoDelete(photo.id)} className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="p-2 flex-grow flex flex-col">
                {editingPhotoId === photo.id ? (
                  <div className="flex-grow flex flex-col">
                    <input type="text" value={editingCaption} onChange={(e) => setEditingCaption(e.target.value)} className="w-full text-sm p-1 border rounded mb-2"/>
                    <div className="flex gap-2 mt-auto">
                      <button onClick={() => handleCaptionSave(photo.id)} className="text-xs bg-green-500 text-white px-2 py-1 rounded">저장</button>
                      <button onClick={() => setEditingPhotoId(null)} className="text-xs bg-gray-500 text-white px-2 py-1 rounded">취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-grow flex flex-col">
                    <p className="text-sm text-gray-700 flex-grow">{photo.caption || '설명 없음'}</p>
                    <button onClick={() => startEditingCaption(photo)} className="mt-2 text-xs text-blue-600 hover:underline self-start">
                      설명 수정
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAboutPage;
