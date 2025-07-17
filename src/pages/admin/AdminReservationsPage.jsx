// =================================================================
// 관리자 예약 관리 페이지 (AdminReservationsPage.jsx)
// 파일 경로: /src/pages/admin/AdminReservationsPage.jsx
// 주요 기능:
// 1. 모든 예약 문의 목록을 불러와서 표시
// 2. 각 예약의 상태(대기, 확정, 완료, 취소)를 변경하는 기능
// 3. 완료되거나 취소된 예약을 삭제하는 기능
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AdminReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/admin/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('예약 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem('accessToken');
    try {
      await axios.put(`${API_URL}/api/admin/reservations/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchReservations(); // 목록 새로고침
    } catch (err) {
      alert('상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말로 이 예약 정보를 삭제하시겠습니까?')) {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.delete(`${API_URL}/api/admin/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('예약 정보가 삭제되었습니다.');
        fetchReservations();
      } catch (err) {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('ko-KR');

  const statusStyles = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  if (isLoading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">예약 관리</h1>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">신청일</th>
                <th className="p-3 text-left">예약자</th>
                <th className="p-3 text-left">연락처</th>
                <th className="p-3 text-left">희망일시</th>
                <th className="p-3 text-left">문의사항</th>
                <th className="p-3 text-left">상태</th>
                <th className="p-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-b">
                  <td className="p-3">{formatDate(res.createdAt)}</td>
                  <td className="p-3">{res.patientName}</td>
                  <td className="p-3">{res.phoneNumber}</td>
                  <td className="p-3">{formatDate(res.desiredDate)} {res.desiredTime}</td>
                  <td className="p-3 max-w-xs truncate">{res.notes}</td>
                  <td className="p-3">
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className={`p-1 rounded text-sm ${statusStyles[res.status]}`}
                    >
                      <option value="pending">대기</option>
                      <option value="confirmed">확정</option>
                      <option value="completed">완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <button onClick={() => handleDelete(res.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminReservationsPage;
