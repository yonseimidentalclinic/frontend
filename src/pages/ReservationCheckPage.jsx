// src/pages/ReservationCheckPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const ReservationCheckPage = () => {
  const [formData, setFormData] = useState({ patientName: '', phoneNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await api.post('/reservations/verify', formData);
      // 임시 토큰을 sessionStorage에 저장 (브라우저를 닫으면 사라짐)
      sessionStorage.setItem('reservationToken', response.data.accessToken);
      navigate(`/reservation/${response.data.reservationId}`);
    } catch (err) {
      setError('일치하는 예약 정보를 찾을 수 없습니다.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">예약 확인</h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <p className="text-center text-gray-600">예약 시 입력하신 이름과 연락처를 입력해주세요.</p>
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">이름</label>
          <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">연락처</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="'-' 없이 숫자만 입력" className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        {error && <p className="text-sm text-red-600 text-center">{error}</p>}
        <button type="submit" disabled={loading} className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300">
          {loading ? '조회 중...' : '예약 조회하기'}
        </button>
      </form>
    </div>
  );
};

export default ReservationCheckPage;
