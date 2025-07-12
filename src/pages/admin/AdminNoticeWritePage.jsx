import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import AdminNoticeForm from '../../components/AdminNoticeForm';

function AdminNoticeWritePage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  const handleSubmit = async (formData) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/notices`;
      await axios.post(apiUrl, formData, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('공지사항이 등록되었습니다.');
      navigate('/admin/notices');
    } catch (error) {
      alert('등록에 실패했습니다.');
      console.error("Failed to create notice", error);
    }
  };

  return (
    <>
      <Helmet><title>새 공지사항 작성 | 연세미치과</title></Helmet>
      <h1 className="text-2xl font-bold mb-6">새 공지사항 작성</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <AdminNoticeForm onSubmit={handleSubmit} isEditing={false} />
      </div>
    </>
  );
}

export default AdminNoticeWritePage;
