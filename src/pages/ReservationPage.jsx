// =================================================================
// 사용자용 온라인 예약 페이지 (ReservationPage.jsx) - 스케줄 기능 적용
// 파일 경로: /src/pages/ReservationPage.jsx
// 주요 기능:
// 1. 날짜 선택 시, 해당 날짜의 예약 가능/불가 시간 정보를 서버에서 불러옴
// 2. 예약이 불가능한 시간대는 비활성화하여 사용자가 선택할 수 없도록 처리
// =================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const ReservationPage = () => {
  const [formData, setFormData] = useState({
    patientName: '',
    phoneNumber: '',
    desiredDate: '',
    desiredTime: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const navigate = useNavigate();

  const timeSlots = [
    '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  // [핵심 추가] 날짜가 변경될 때마다 해당 날짜의 예약 현황을 불러옵니다.
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.desiredDate) return;
      
      const date = new Date(formData.desiredDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      try {
        const response = await axios.get(`${API_URL}/api/schedule`, { params: { year, month } });
        const scheduleForDate = response.data[formData.desiredDate] || [];
        setBookedSlots(scheduleForDate);
      } catch (err) {
        console.error("예약 현황 로딩 실패:", err);
        // 실패 시 모든 시간을 선택 가능하게 둠 (서버 오류로 예약이 막히는 것을 방지)
        setBookedSlots([]);
      }
    };
    fetchBookedSlots();
  }, [formData.desiredDate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // 날짜가 변경되면 시간 선택을 초기화
    if (name === 'desiredDate') {
      setFormData(prev => ({ ...prev, desiredDate: value, desiredTime: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { patientName, phoneNumber, desiredDate, desiredTime } = formData;
    if (!patientName || !phoneNumber || !desiredDate || !desiredTime) {
      alert('이름, 연락처, 희망 날짜와 시간은 필수 항목입니다.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await axios.post(`${API_URL}/api/reservations`, formData);
      alert('예약 신청이 성공적으로 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.');
      navigate('/');
    } catch (err) {
      alert('예약 신청에 실패했습니다. 다른 시간을 선택하시거나 병원으로 문의해주세요.');
      console.error('Reservation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">온라인 예약</h1>
          <p className="text-gray-500 mt-2">
            편하신 시간에 예약 문의를 남겨주시면, 확인 후 신속하게 연락드리겠습니다.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="patientName" className="block text-lg font-semibold text-gray-700 mb-2">예약자 성함</label>
              <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-lg font-semibold text-gray-700 mb-2">연락처</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="예: 010-1234-5678" className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label htmlFor="desiredDate" className="block text-lg font-semibold text-gray-700 mb-2">희망 날짜</label>
              <input type="date" name="desiredDate" id="desiredDate" value={formData.desiredDate} onChange={handleInputChange} className="w-full p-3 border rounded-md" required />
            </div>
            <div>
              <label htmlFor="desiredTime" className="block text-lg font-semibold text-gray-700 mb-2">희망 시간</label>
              <select name="desiredTime" id="desiredTime" value={formData.desiredTime} onChange={handleInputChange} className="w-full p-3 border rounded-md bg-white" required disabled={!formData.desiredDate}>
                <option value="" disabled>날짜를 먼저 선택하세요</option>
                {formData.desiredDate && timeSlots.map(time => {
                  const isBooked = bookedSlots.includes(time);
                  return (
                    <option key={time} value={time} disabled={isBooked}>
                      {time} {isBooked ? '(마감)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
            <div>
              <label htmlFor="notes" className="block text-lg font-semibold text-gray-700 mb-2">문의 사항 (선택)</label>
              <textarea name="notes" id="notes" value={formData.notes} onChange={handleInputChange} rows="4" placeholder="간단한 증상이나 문의사항을 남겨주세요." className="w-full p-3 border rounded-md"></textarea>
            </div>
            <div className="text-center">
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? '신청 중...' : '예약 신청하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservationPage;
