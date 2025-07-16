// =================================================================
// 관리자 병원 사진 관리 페이지 (AdminClinicPhotosPage.jsx)
// 파일 경로: /src/pages/admin/AdminClinicPhotosPage.jsx
// 주요 기능:
// 1. 병원 사진(진료실, 대기실 등) 목록을 불러와서 표시
// 2. 새 사진 파일을 업로드하고 간단한 설명을 추가하는 기능
// 3. 기존 사진을 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { Plus, Trash2, Upload } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const API_URL = import.meta.env.VITE_API_URL;

const AdminClinicPhotosPage = () => {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [caption, setCaption] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchPhotos = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/clinic-photos`);
      setPhotos(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('병원 사진을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setSelectedFile(compressedFile);
    } catch (error) {
      alert('이미지 압축에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('사진 파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('caption', caption);
    formData.append('image', selectedFile);

    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(`${API_URL}/api/admin/clinic-photos`, formData, { headers });
      alert('사진이 성공적으로 추가되었습니다.');
      setCaption('');
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }
      fetchPhotos();
    } catch (err) {
      alert('업로드에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('정말로 이 사진을 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/clinic-photos/${photoId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('사진이 삭제되었습니다.');
        fetchPhotos();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">병원 사진 관리</h1>

        <div className="bg-white p-8 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">새 사진 추가</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="사진 설명 (예: 1번 진료실)"
              className="w-full p-2 border rounded"
            />
            <div className="flex items-center gap-4">
               <label htmlFor="photoUpload" className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                <Upload className="w-4 h-4 mr-2" />
                사진 파일 선택
              </label>
              <input ref={fileInputRef} id="photoUpload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              {selectedFile && <span className="text-gray-600">{selectedFile.name}</span>}
            </div>
            <div className="flex justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center">
                <Plus className="mr-1 w-4 h-4" /> 추가하기
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 p-6 border-b">등록된 사진 목록</h2>
          {isLoading && <p className="p-4 text-center">로딩 중...</p>}
          {error && <p className="p-4 text-center text-red-500">{error}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
            {photos.map(photo => (
              <div key={photo.id} className="border rounded-lg overflow-hidden group relative">
                <img src={photo.imageData} alt={photo.caption || '병원 사진'} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <p className="truncate">{photo.caption || '설명 없음'}</p>
                </div>
                <div className="absolute top-2 right-2">
                  <button onClick={() => handleDelete(photo.id)} className="bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminClinicPhotosPage;
