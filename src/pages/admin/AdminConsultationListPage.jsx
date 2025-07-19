// src/pages/admin/AdminConsultationListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { MessageSquare, Edit, Trash2, CheckSquare, Lock } from 'lucide-react';

const AdminConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchConsultations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/consultations', { params: { limit: 1000 } });
      setConsultations(response.data.items);
    } catch (err) {
      setError('상담글 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConsultations();
  }, [fetchConsultations]);

  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] 상담글을 정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await api.delete(`/admin/consultations/${id}`);
        fetchConsultations();
        alert('상담글이 삭제되었습니다.');
      } catch (err) {
        alert('상담글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">온라인상담 관리</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">제목</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성자</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작성일</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {consultations.map((item) => (
              <tr key={item.id} className={!item.isAnswered ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.isAnswered ? 
                    <span className="text-blue-600 font-semibold flex items-center"><CheckSquare size={16} className="mr-1"/>답변완료</span> : 
                    <span className="text-red-600 font-semibold">답변대기</span>
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap font-medium flex items-center gap-2">
                  {item.isSecret && <Lock size={16} className="text-gray-400" />}
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(item.createdAt).toLocaleString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => navigate(`/admin/consultations/reply/${item.id}`)} title="답변/수정" className="text-blue-600 hover:text-blue-900"><MessageSquare size={20} /></button>
                    <button onClick={() => navigate(`/admin/consultations/edit/${item.id}`)} title="글 내용 수정" className="text-indigo-600 hover:text-indigo-900"><Edit size={20} /></button>
                    <button onClick={() => handleDelete(item.id)} title="삭제" className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminConsultationListPage;
