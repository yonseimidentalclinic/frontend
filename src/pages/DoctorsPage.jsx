// src/pages/DoctorsPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';
// --- 핵심 추가: 애니메이션 라이브러리를 불러옵니다. ---
import { motion } from 'framer-motion';

// 애니메이션 효과를 위한 설정
const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: "easeOut" }
};

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (err) {
        setError("의료진 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-12 px-4 text-center sm:px-6 lg:px-8 lg:py-24">
        <motion.div {...fadeInAnimation} className="space-y-12">
          <div className="space-y-5 sm:mx-auto sm:max-w-xl sm:space-y-4 lg:max-w-5xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">의료진 소개</h2>
            <p className="text-xl text-gray-500">
              연세미치과는 각 분야별 전문 의료진이 책임감을 가지고 진료합니다.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12"
          >
            {doctors.map((doctor, index) => (
              <motion.li 
                key={doctor.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-4"
              >
                <div className="aspect-w-3 aspect-h-4">
                  <img className="object-cover shadow-lg rounded-lg" src={doctor.imageData || 'https://placehold.co/400x500?text=No+Image'} alt={`${doctor.name} ${doctor.position}`} />
                </div>

                <div className="space-y-2">
                  <div className="text-lg leading-6 font-medium space-y-1">
                    <h3 className="text-2xl font-bold">{doctor.name}</h3>
                    <p className="text-indigo-600">{doctor.position}</p>
                  </div>
                  <div className="text-lg">
                    {/* whitespace-pre-line: DB에 저장된 줄바꿈을 그대로 화면에 표시해줍니다. */}
                    <p className="text-gray-500 whitespace-pre-line">{doctor.history}</p>
                  </div>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorsPage;
