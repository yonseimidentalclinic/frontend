// src/pages/ReservationPage.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    desiredDate: '',
    desiredTime: '',
    notes: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/reservations', formData);
      alert('예약 신청이 완료되었습니다. 확인 후 연락드리겠습니다.');
      navigate('/');
    } catch (error) {
      alert('예약 신청에 실패했습니다.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">온라인 예약</h1>
      
      {/* --- 핵심 추가: 예약 확인 페이지로 이동하는 링크 --- */}
      <div className="text-center mb-8 p-4 bg-gray-100 rounded-lg">
        <p>이미 예약을 하셨나요? <Link to="/reservation/check" className="font-semibold text-indigo-600 hover:underline">예약 확인 및 변경/취소</Link></p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 shadow-lg rounded-lg">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">이름</label>
          <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">연락처</label>
          <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required placeholder="'-' 없이 숫자만 입력" className="mt-1 block w-full px-3 py-2 border rounded-md" />
        </div>
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
        <button type="submit" className="w-full px-4 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700">
          예약 신청하기
        </button>
      </form>
    </div>
  );
};

export default ReservationPage;
