// src/pages/ReservationEditPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const ReservationEditPage = () => {
  const [formData, setFormData] = useState({ desiredDate: '', desiredTime: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchReservation = useCallback(async () => {
    const token = sessionStorage.getItem('reservationToken');
    if (!token) {
      alert('인증 정보가 만료되었습니다. 다시 확인해주세요.');
      navigate('/reservation/check');
      return;
    }
    try {
      const response = await api.get(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({
        desiredDate: new Date(response.data.desiredDate).toISOString().split('T')[0],
        desiredTime: response.data.desiredTime,
        notes: response.data.notes || ''
      });
    } catch (err) {
      alert('예약 정보를 불러오는 데 실패했습니다.');
      navigate('/reservation/check');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchReservation();
  }, [fetchReservation]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem('reservationToken');
    try {
      await api.put(`/reservations/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('예약이 성공적으로 변경되었습니다. 다시 확인 후 확정됩니다.');
      navigate(`/reservation/${id}`);
    } catch (err) {
      alert('예약 변경에 실패했습니다.');
    }
  };

  if (loading) return <div className="text-center py-20">로딩 중...</div>;

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">예약 변경</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label htmlFor="desiredDate" className="block text-sm font-medium text-gray-700">원하시는 날짜</label>
          <input type="date" name="desiredDate" id="desiredDate" value={formData.desiredDate} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="desiredTime" className="block text-sm font-medium text-gray-700">원하시는 시간</label>
          <select name="desiredTime" id="desiredTime" value={formData.desiredTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md">
            <option value="">시간 선택</option>
            <option value="10:00">10:00</option>
            <option value="11:00">11:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="15:00">15:00</option>
            <option value="16:00">16:00</option>
            <option value="17:00">17:00</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">남기실 말 (선택)</label>
          <textarea name="notes" id="notes" value={formData.notes} onChange={handleChange} rows="4" className="mt-1 block w-full px-3 py-2 border rounded-md"></textarea>
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => navigate(`/reservation/${id}`)} className="flex-1 px-4 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300">
            취소
          </button>
          <button type="submit" className="flex-1 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
            변경 요청
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReservationEditPage;
