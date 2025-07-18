// =================================================================
// 사용자용 온라인 예약 페이지 (ReservationPage.jsx) - 최종 완성본
// 최종 업데이트: 2025년 7월 18일
// 주요 개선사항:
// 1. 시간 선택 UI를 드롭다운 목록에서 시각적인 버튼 그리드로 변경
// 2. 각 시간 버튼을 상태(예약 가능/마감)에 따라 다른 색상으로 표시
// 3. 사용자가 선택한 시간을 명확하게 표시하여 편의성 증대
// =================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Calendar, Clock, User, Phone } from 'lucide-react';

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

  // 날짜가 변경될 때마다 해당 날짜의 예약 현황을 불러옵니다.
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!formData.desiredDate) {
        setBookedSlots([]);
        return;
      }
      
      const date = new Date(formData.desiredDate);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      try {
        const response = await axios.get(`${API_URL}/api/schedule`, { params: { year, month } });
        const scheduleForDate = response.data[formData.desiredDate] || {};
        
        // 확정된 예약(confirmed) 또는 관리자가 수동으로 마감(blocked)한 시간을 예약 불가 처리
        const unavailableTimes = Object.entries(scheduleForDate)
          .filter(([time, status]) => status.confirmed > 0 || status.blocked)
          .map(([time]) => time);
          
        setBookedSlots(unavailableTimes);
      } catch (err) {
        console.error("예약 현황 로딩 실패:", err);
        setBookedSlots([]); // 오류 발생 시 모든 시간을 선택 가능하게 둠
      }
    };
    fetchBookedSlots();
  }, [formData.desiredDate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'desiredDate') {
      setFormData(prev => ({ ...prev, desiredDate: value, desiredTime: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleTimeSlotClick = (time) => {
    // 이미 마감된 시간은 선택할 수 없음
    if (bookedSlots.includes(time)) return;
    setFormData(prev => ({ ...prev, desiredTime: time }));
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
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">온라인 예약</h1>
          <p className="text-gray-500 mt-2">
            편하신 시간에 예약 문의를 남겨주시면, 확인 후 신속하게 연락드리겠습니다.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1단계: 예약자 정보 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center"><User className="w-6 h-6 mr-2 text-blue-600"/>예약자 정보</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="patientName" className="block text-md font-medium text-gray-600 mb-1">성함</label>
                        <input type="text" name="patientName" id="patientName" value={formData.patientName} onChange={handleInputChange} className="w-full p-3 border rounded-md" required />
                    </div>
                    <div>
                        <label htmlFor="phoneNumber" className="block text-md font-medium text-gray-600 mb-1">연락처</label>
                        <input type="tel" name="phoneNumber" id="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="010-1234-5678" className="w-full p-3 border rounded-md" required />
                    </div>
                </div>
            </div>

            {/* 2단계: 날짜 및 시간 선택 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center"><Calendar className="w-6 h-6 mr-2 text-blue-600"/>희망 날짜 및 시간</h2>
                <div>
                    <label htmlFor="desiredDate" className="block text-md font-medium text-gray-600 mb-1">날짜 선택</label>
                    <input type="date" name="desiredDate" id="desiredDate" value={formData.desiredDate} onChange={handleInputChange} className="w-full p-3 border rounded-md" required />
                </div>
                {formData.desiredDate && (
                    <div>
                        <label className="block text-md font-medium text-gray-600 mb-2">시간 선택</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {timeSlots.map(time => {
                                const isBooked = bookedSlots.includes(time);
                                const isSelected = formData.desiredTime === time;
                                return (
                                    <button
                                        type="button"
                                        key={time}
                                        onClick={() => handleTimeSlotClick(time)}
                                        disabled={isBooked}
                                        className={`p-3 rounded-md text-center font-semibold transition-colors
                                            ${isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : ''}
                                            ${!isBooked && isSelected ? 'bg-blue-600 text-white' : ''}
                                            ${!isBooked && !isSelected ? 'bg-white text-blue-600 border border-blue-500 hover:bg-blue-50' : ''}
                                        `}
                                    >
                                        {time}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* 3단계: 문의사항 및 신청 */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 flex items-center"><Clock className="w-6 h-6 mr-2 text-blue-600"/>문의 사항 (선택)</h2>
                <textarea name="notes" id="notes" value={formData.notes} onChange={handleInputChange} rows="4" placeholder="간단한 증상이나 문의사항을 남겨주세요." className="w-full p-3 border rounded-md"></textarea>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-4 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300">
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
