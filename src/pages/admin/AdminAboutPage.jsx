// =================================================================
// 관리자 병원소개 관리 페이지 (AdminAboutPage.jsx)
// 파일 경로: /src/pages/admin/AdminAboutPage.jsx
// 주요 기능:
// 1. 병원소개 페이지의 제목, 부제목, 본문, 대표 이미지를 관리
// 2. 병원 사진 갤러리의 사진을 추가/삭제
// 3. 이미지 리사이징 기능을 포함하여 안정적인 파일 업로드 지원
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Save, Upload, Plus, Trash2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const AdminAboutPage = () => {
  const [mainContent, setMainContent] = useState({ title: '', subtitle: '', content: '', imageData: '' });
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const [newPhotoCaption, setNewPhotoCaption] = useState('');
  const [newPhotoImageData, setNewPhotoImageData] = useState('');

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [aboutRes, photosRes] = await Promise.all([
        axios.get(`${API_URL}/api/about`),
        axios.get(`${API_URL}/api/clinic-photos`)
      ]);
      if (aboutRes.data) setMainContent(aboutRes.data);
      setPhotos(Array.isArray(photosRes.data) ? photosRes.data : []);
    } catch (err) {
      setError('콘텐츠를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleMainInputChange = (e) => {
    const { name, value } = e.target;
    setMainContent(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = { maxSizeMB: 1, maxWidthOrHeight: 1200, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => {
        if (type === 'main') {
          setMainContent(prev => ({ ...prev, imageData: reader.result }));
        } else if (type === 'gallery') {
          setNewPhotoImageData(reader.result);
        }
      };
    } catch (error) {
      alert('이미지 압축에 실패했습니다.');
    }
    e.target.value = null;
  };

  const handleMainSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/api/admin/about`, mainContent, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('성공적으로 저장되었습니다.');
    } catch (err) {
      alert('저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddPhoto = async (e) => {
    e.preventDefault();
    if (!newPhotoImageData) return alert('사진 파일을 선택해주세요.');
    
    const token = localStorage.getItem('accessToken');
    const data = { caption: newPhotoCaption, imageData: newPhotoImageData };
    try {
      await axios.post(`${API_URL}/api/admin/clinic-photos`, data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('사진이 추가되었습니다.');
      setNewPhotoCaption('');
      setNewPhotoImageData('');
      fetchData(); // 목록 새로고침
    } catch (err) {
      alert('사진 추가에 실패했습니다.');
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (window.confirm('정말로 이 사진을 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/clinic-photos/${photoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('사진이 삭제되었습니다.');
        fetchData(); // 목록 새로고침
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">병원소개 페이지 관리</h1>
        
        {/* 메인 콘텐츠 관리 */}
        <form onSubmit={handleMainSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">메인 콘텐츠 수정</h2>
          <div>
            <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">페이지 제목</label>
            <input id="title" name="title" type="text" value={mainContent.title || ''} onChange={handleMainInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="subtitle" className="block font-semibold text-gray-700 mb-1">부제목</label>
            <input id="subtitle" name="subtitle" type="text" value={mainContent.subtitle || ''} onChange={handleMainInputChange} className="w-full p-2 border rounded-md" />
          </div>
          <div>
            <label htmlFor="content" className="block font-semibold text-gray-700 mb-1">본문 내용</label>
            <textarea id="content" name="content" value={mainContent.content || ''} onChange={handleMainInputChange} rows="6" className="w-full p-2 border rounded-md"></textarea>
          </div>
          <div>
            <label className="block font-semibold text-gray-700 mb-1">대표 이미지</label>
            <div className="flex items-center gap-4">
              <label htmlFor="mainImageUpload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" /> 사진 교체
              </label>
              <input id="mainImageUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'main')} className="hidden" />
              {mainContent.imageData && <img src={mainContent.imageData} alt="미리보기" className="w-32 h-32 object-cover rounded-md border" />}
            </div>
          </div>
          <div className="flex justify-end">
            <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-6 py-2 rounded-md flex items-center disabled:bg-blue-300">
              <Save className="mr-2 w-5 h-5" /> {isSaving ? '저장 중...' : '메인 콘텐츠 저장'}
            </button>
          </div>
        </form>

        {/* 갤러리 관리 */}
        <div className="bg-white p-8 rounded-lg shadow-md space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">병원 사진 갤러리 관리</h2>
          <form onSubmit={handleAddPhoto} className="flex items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="caption" className="block font-semibold text-gray-700 mb-1">사진 설명 (선택)</label>
              <input id="caption" type="text" value={newPhotoCaption} onChange={(e) => setNewPhotoCaption(e.target.value)} placeholder="예: 1번 진료실" className="w-full p-2 border rounded-md" />
            </div>
            <div>
              <label htmlFor="galleryImageUpload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" /> 사진 선택
              </label>
              <input id="galleryImageUpload" type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'gallery')} className="hidden" />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md flex items-center">
              <Plus className="mr-2 w-5 h-5" /> 추가
            </button>
          </form>
          {newPhotoImageData && <div className="text-center"><img src={newPhotoImageData} alt="새 사진 미리보기" className="inline-block h-24 border rounded-md" /></div>}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map(photo => (
              <div key={photo.id} className="relative group">
                <img src={photo.imageData} alt={photo.caption} className="w-full h-32 object-cover rounded-md" />
                <p className="text-sm truncate mt-1">{photo.caption}</p>
                <button onClick={() => handleDeletePhoto(photo.id)} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAboutPage;
