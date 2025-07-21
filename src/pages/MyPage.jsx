// src/pages/MyPage.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Calendar, MessageSquare } from 'lucide-react';

const MyPage = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resReservations, resConsultations] = await Promise.all([
          api.get('/auth/me/reservations'),
          api.get('/auth/me/consultations')
        ]);
        setReservations(resReservations.data);
        setConsultations(resConsultations.data);
      } catch (error) {
        console.error("마이페이지 데이터 로딩 실패", error);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">마이페이지</h1>
      <p className="text-lg text-gray-600 mb-8">안녕하세요, <span className="font-semibold text-indigo-600">{user.username}</span>님!</p>

      <div className="space-y-12">
        {/* 내 예약 내역 */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4"><Calendar /> 내 예약 내역</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {reservations.length > 0 ? (
              <ul className="divide-y">
                {reservations.map(res => (
                  <li key={res.id} className="py-3 flex justify-between items-center">
                    <span>{new Date(res.desiredDate).toLocaleDateString('ko-KR')} {res.desiredTime}</span>
                    <span className="font-semibold text-indigo-600">{res.status}</span>
                  </li>
                ))}
              </ul>
            ) : <p>예약 내역이 없습니다.</p>}
          </div>
        </div>

        {/* 내 상담 내역 */}
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-3 mb-4"><MessageSquare /> 내 상담 내역</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {consultations.length > 0 ? (
              <ul className="divide-y">
                {consultations.map(con => (
                  <li key={con.id} className="py-3">
                    <p className="font-semibold">{con.title}</p>
                    <p className="text-sm text-gray-500">{con.isAnswered ? "답변완료" : "답변대기"}</p>
                  </li>
                ))}
              </ul>
            ) : <p>상담 내역이 없습니다.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
