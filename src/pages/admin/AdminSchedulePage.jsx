// =================================================================
// 관리자 스케줄 관리 페이지 (AdminSchedulePage.jsx)
// 파일 경로: /src/pages/admin/AdminSchedulePage.jsx
// 주요 기능:
// 1. 달력 형태로 해당 월의 예약 현황을 시각적으로 표시
// 2. 특정 날짜의 시간대별로 예약 '확정' 건수와 '수동 마감' 상태를 보여줌
// 3. 관리자가 직접 특정 시간대를 '수동 마감'하거나 '마감 해제'하는 기능
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Calendar, Clock, Lock, Unlock } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const timeSlots = [
  '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
];

const AdminSchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedule, setSchedule] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const fetchSchedule = useCallback(async (date) => {
    setIsLoading(true);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/schedule`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year, month }
      });
      setSchedule(response.data);
    } catch (err) {
      console.error("스케줄 로딩 실패:", err);
      alert('스케줄을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule(currentDate);
  }, [currentDate, fetchSchedule]);

  const handleSlotToggle = async (date, time) => {
    const isBlocked = schedule[date]?.includes(time);
    const action = isBlocked ? 'delete' : 'post';
    const url = `${API_URL}/api/admin/blocked-slots`;
    const token = localStorage.getItem('accessToken');
    
    try {
      await axios({
        method: action,
        url: url,
        data: { slotDate: date, slotTime: time },
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSchedule(currentDate); // 성공 후 스케줄 다시 불러오기
    } catch (err) {
      alert('작업에 실패했습니다.');
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();

    let blanks = [];
    for (let i = 0; i < firstDay; i++) {
      blanks.push(<div key={`blank-${i}`} className="border p-2 text-center"></div>);
    }

    let days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isSelected = selectedDate.toISOString().split('T')[0] === dateStr;
      const isToday = today.toISOString().split('T')[0] === dateStr;
      
      days.push(
        <div 
          key={d} 
          className={`border p-2 text-center cursor-pointer ${isSelected ? 'bg-blue-500 text-white' : isToday ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => setSelectedDate(new Date(year, month, d))}
        >
          {d}
        </div>
      );
    }
    return [...blanks, ...days];
  };

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedDaySchedule = schedule[selectedDateStr] || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">예약 스케줄 관리</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
              <h2 className="text-2xl font-bold">{`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}</h2>
              <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center font-semibold mb-2">
              <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {renderCalendar()}
            </div>
          </div>
          {/* Time Slots for selected date */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Calendar className="w-5 h-5 mr-2" />{selectedDate.toLocaleDateString('ko-KR')}</h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {timeSlots.map(time => {
                const isBooked = selectedDaySchedule.includes(time);
                return (
                  <div key={time} className={`flex items-center justify-between p-3 rounded-md ${isBooked ? 'bg-red-100' : 'bg-green-100'}`}>
                    <span className="font-semibold flex items-center"><Clock className="w-4 h-4 mr-2" />{time}</span>
                    <button 
                      onClick={() => handleSlotToggle(selectedDateStr, time)}
                      className={`px-3 py-1 text-sm rounded-full text-white flex items-center ${isBooked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                    >
                      {isBooked ? <Lock className="w-3 h-3 mr-1" /> : <Unlock className="w-3 h-3 mr-1" />}
                      {isBooked ? '마감됨' : '예약가능'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
