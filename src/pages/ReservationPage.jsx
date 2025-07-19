// src/pages/ReservationPage.jsx

import React, { useState, useEffect } from 'react';
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
  const [schedule, setSchedule] = useState({});
  const navigate = useNavigate();

  // 날짜가 변경될 때마다 해당 월의 스케줄을 가져옵니다.
  useEffect(() => {
    const fetchSchedule = async () => {
      if (!formData.desiredDate) return;
      const date = new Date(formData.desiredDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      try {
        const response = await api.get('/schedule', { params: { year, month } });
        setSchedule(response.data);
      } catch (error) {
        console.error("스케줄 로딩 실패", error);
      }
    };
    fetchSchedule();
  }, [formData.desiredDate]);

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

  const timeSlots = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const getSlotStatus = (time) => {
    if (!formData.desiredDate) return { status: '가능', disabled: false, color: 'text-green-600' };
    
    const slotData = schedule[formData.desiredDate]?.[time];
    if (slotData?.blocked) return { status: '마감', disabled: true, color: 'text-gray-400' };
    if (slotData?.confirmed > 0) return { status: '불가', disabled: true, color: 'text-red-500' };
    if (slotData?.pending > 0) return { status: '대기', disabled: false, color: 'text-yellow-600' };
    return { status: '가능', disabled: false, color: 'text-green-600' };
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">온라인 예약</h1>
      
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
            {timeSlots.map(time => {
              const { status, disabled, color } = getSlotStatus(time);
              return <option key={time} value={time} disabled={disabled} className={color}>{time} ({status})</option>
            })}
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
