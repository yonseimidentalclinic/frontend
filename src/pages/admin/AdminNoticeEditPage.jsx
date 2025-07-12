import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import AdminNoticeForm from '../../components/AdminNoticeForm';

function AdminNoticeEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        // 수정할 공지사항의 기존 데이터를 불러옵니다.
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/notices/${id}`;
        const response = await axios.get(apiUrl);
        setInitialData({ title: response.data.title, content: response.data.content });
      } catch (error) {
        console.error("Failed to fetch notice", error);
        alert('공지사항 정보를 불러오는 데 실패했습니다.');
      }
    };
    fetchNotice();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      // 수정한 내용을 백엔드로 보내 업데이트를 요청합니다.
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/notices/${id}`;
      await axios.put(apiUrl, formData, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('공지사항이 성공적으로 수정되었습니다.');
      navigate('/admin/notices'); // 수정 후 목록 페이지로 이동
    } catch (error) {
      alert('수정에 실패했습니다.');
      console.error("Failed to update notice", error);
    }
  };

  // 데이터를 불러오는 동안 로딩 메시지를 보여줍니다.
  if (!initialData) return <div>로딩 중...</div>;

  return (
    <>
      <Helmet><title>공지사항 수정 | 연세미치과</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">공지사항 수정</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <AdminNoticeForm initialData={initialData} onSubmit={handleSubmit} isEditing={true} />
      </div>
    </>
  );
}

export default AdminNoticeEditPage;
