// src/pages/ReservationDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ReservationDetailPage = () => {
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchReservation = useCallback(async () => {
    const token = sessionStorage.getItem('reservationToken');
    if (!token) {
      setError('인증 정보가 없습니다. 다시 확인해주세요.');
      setLoading(false);
      return;
    }
    try {
      const response = await api.get(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservation(response.data);
    } catch (err) {
      setError('예약 정보를 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const handleCancel = async () => {
    if (window.confirm('정말로 예약을 취소하시겠습니까?')) {
      const token = sessionStorage.getItem('reservationToken');
      try {
        await api.delete(`/reservations/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        sessionStorage.removeItem('reservationToken');
        alert('예약이 성공적으로 취소되었습니다.');
        navigate('/');
      } catch (err) {
        alert('예약 취소에 실패했습니다.');
      }
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!reservation) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">나의 예약 정보</h1>
      <div className="bg-white p-8 shadow-lg rounded-lg space-y-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">이름:</span>
          <span>{reservation.patientName}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">연락처:</span>
          <span>{reservation.phoneNumber}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">예약일시:</span>
          <span>{new Date(reservation.desiredDate).toLocaleDateString('ko-KR')} {reservation.desiredTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">상태:</span>
          <span className="font-bold text-indigo-600">{reservation.status}</span>
        </div>
        {reservation.notes && (
          <div>
            <span className="font-semibold text-gray-600">남기신 말:</span>
            <p className="mt-1 p-2 bg-gray-50 rounded">{reservation.notes}</p>
          </div>
        )}
      </div>
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link to={`/reservation/edit/${id}`} className="flex-1 text-center px-4 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600">
          예약 변경
        </Link>
        <button onClick={handleCancel} className="flex-1 px-4 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600">
          예약 취소
        </button>
      </div>
    </div>
  );
};

export default ReservationDetailPage;
