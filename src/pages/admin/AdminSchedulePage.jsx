// src/pages/admin/AdminSchedulePage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AdminSchedulePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const response = await api.get('/schedule', { params: { year, month } });
        setSchedule(response.data);
      } catch (error) {
        console.error('스케줄 데이터를 불러오는 데 실패했습니다.', error);
        alert('스케줄 데이터를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [year, month]);

  const handleSlotClick = async (date, time) => {
    const isBlocked = schedule[date]?.[time]?.blocked;
    const hasReservation = schedule[date]?.[time]?.confirmed > 0 || schedule[date]?.[time]?.pending > 0;

    if (hasReservation) {
      alert('예약이 있는 시간대는 마감할 수 없습니다.');
      return;
    }

    const action = isBlocked ? '해제' : '마감';
    if (window.confirm(`${date} ${time} 시간대를 예약 ${action}하시겠습니까?`)) {
      try {
        if (isBlocked) {
          await api.delete('/admin/blocked-slots', { data: { slotDate: date, slotTime: time } });
        } else {
          await api.post('/admin/blocked-slots', { slotDate: date, slotTime: time });
        }
        // Optimistic update
        setSchedule(prev => {
          const newSchedule = { ...prev };
          if (!newSchedule[date]) newSchedule[date] = {};
          if (!newSchedule[date][time]) newSchedule[date][time] = { pending: 0, confirmed: 0, blocked: false };
          newSchedule[date][time].blocked = !isBlocked;
          return newSchedule;
        });
      } catch (error) {
        alert(`예약 ${action} 처리에 실패했습니다.`);
      }
    }
  };

  const daysInMonth = useMemo(() => new Date(year, month, 0).getDate(), [year, month]);
  const firstDayOfMonth = useMemo(() => new Date(year, month - 1, 1).getDay(), [year, month]);
  const timeSlots = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];

  const changeMonth = (offset) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + offset, 1));
  };
  
  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">스케줄 관리</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronLeft /></button>
          <h2 className="text-2xl font-semibold">{`${year}년 ${month}월`}</h2>
          <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-gray-200"><ChevronRight /></button>
        </div>
        <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b">
          {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day} className="py-2">{day}</div>)}
        </div>
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="border-r border-b h-40"></div>)}
          {Array.from({ length: daysInMonth }).map((_, day) => {
            const date = `${year}-${String(month).padStart(2, '0')}-${String(day + 1).padStart(2, '0')}`;
            return (
              <div key={day} className="border-r border-b p-1 h-40 overflow-y-auto">
                <div className="font-bold">{day + 1}</div>
                <div className="text-xs space-y-1 mt-1">
                  {timeSlots.map(time => {
                    const slotData = schedule[date]?.[time];
                    const isBlocked = slotData?.blocked;
                    const hasReservation = slotData?.confirmed > 0 || slotData?.pending > 0;
                    let bgColor = 'bg-green-100 hover:bg-green-200';
                    if (isBlocked) bgColor = 'bg-red-200 hover:bg-red-300';
                    if (hasReservation) bgColor = 'bg-blue-200';

                    return (
                      <div 
                        key={time}
                        onClick={() => handleSlotClick(date, time)}
                        className={`p-1 rounded cursor-pointer transition-colors ${bgColor}`}
                      >
                        {time}
                        {isBlocked && <span className="font-bold ml-1 text-red-700">마감</span>}
                        {hasReservation && <span className="font-bold ml-1 text-blue-700">예약</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminSchedulePage;
