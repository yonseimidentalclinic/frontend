// src/pages/admin/AdminReservationListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { Trash2, CheckCircle, Clock, XCircle } from 'lucide-react';

const AdminReservationListPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/reservations');
      setReservations(response.data);
    } catch (err) {
      setError('예약 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/admin/reservations/${id}/status`, { status });
      fetchReservations();
    } catch (err) {
      alert('예약 상태 변경에 실패했습니다.');
    }
  };
  
  const handleDelete = async (id) => {
    if (window.confirm(`[ID: ${id}] 예약 정보를 정말로 삭제하시겠습니까?`)) {
      try {
        await api.delete(`/admin/reservations/${id}`);
        fetchReservations();
        alert('예약 정보가 삭제되었습니다.');
      } catch (err) {
        alert('예약 정보 삭제에 실패했습니다.');
      }
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600';
      case 'confirmed': return 'text-green-600';
      case 'completed': return 'text-blue-600';
      case 'cancelled': return 'text-gray-500';
      default: return '';
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">예약 관리</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">환자명</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">연락처</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">예약일시</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태 변경</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="px-6 py-4 whitespace-nowrap">{res.patientName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{res.phoneNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(res.desiredDate).toLocaleDateString('ko-KR')} {res.desiredTime}</td>
                <td className={`px-6 py-4 whitespace-nowrap font-semibold ${getStatusStyle(res.status)}`}>{res.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex gap-1">
                    <button onClick={() => handleStatusChange(res.id, 'confirmed')} title="확정" className="p-1 text-green-500 hover:text-green-700"><CheckCircle size={20} /></button>
                    <button onClick={() => handleStatusChange(res.id, 'completed')} title="완료" className="p-1 text-blue-500 hover:text-blue-700"><Clock size={20} /></button>
                    <button onClick={() => handleStatusChange(res.id, 'cancelled')} title="취소" className="p-1 text-gray-400 hover:text-gray-600"><XCircle size={20} /></button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button onClick={() => handleDelete(res.id)} className="text-red-500 hover:text-red-700 p-1"><Trash2 size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservationListPage;
