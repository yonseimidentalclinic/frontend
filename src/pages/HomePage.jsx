// src/pages/HomePage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Stethoscope, Calendar, Users, ArrowRight } from 'lucide-react';
// --- 핵심 추가: 애니메이션 라이브러리를 불러옵니다. ---
import { motion } from 'framer-motion';

// 섹션 제목 컴포넌트
const SectionTitle = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{title}</h2>
    <p className="mt-2 text-lg leading-8 text-gray-600">{subtitle}</p>
  </div>
);

// 애니메이션 효과를 위한 설정
const fadeInAnimation = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const HomePage = () => {
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const response = await api.get('/home-summary');
        setHomeData(response.data);
      } catch (error) {
        console.error("메인 페이지 데이터를 불러오는 데 실패했습니다.", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">로딩 중...</div>;
  }

  return (
    <div>
      {/* Hero 섹션 */}
      <div className="relative bg-indigo-800 text-white text-center py-20 md:py-32">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <motion.div 
          className="relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">연세미치과</h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
            환자 한 분 한 분의 건강한 미소를 위해, 저희는 보이지 않는 곳까지 정성을 다합니다.
          </p>
          <Link
            to="/reservation"
            className="mt-8 inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-transform transform hover:scale-105"
          >
            온라인 예약하기
          </Link>
        </motion.div>
      </div>

      {/* 핵심 가치 섹션 */}
      <motion.section {...fadeInAnimation} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Stethoscope size={32} />
            </div>
            <h3 className="text-xl font-bold">전문적인 진료</h3>
            <p className="mt-2 text-gray-600">최신 장비와 숙련된 의료진이 정확하고 안전한 치료를 제공합니다.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Calendar size={32} />
            </div>
            <h3 className="text-xl font-bold">편안한 예약</h3>
            <p className="mt-2 text-gray-600">온라인으로 간편하게 예약하고, 원하는 시간에 진료받으세요.</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 text-indigo-600 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold">환자 중심 소통</h3>
            <p className="mt-2 text-gray-600">언제나 환자의 입장에서 생각하고, 충분한 설명으로 신뢰를 드립니다.</p>
          </div>
        </div>
      </motion.section>

      {/* 최신 병원소식 */}
      {homeData?.notices?.length > 0 && (
        <motion.section {...fadeInAnimation} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="최신 병원소식" subtitle="연세미치과의 새로운 소식을 확인하세요." />
            <div className="mt-12 space-y-8">
              {homeData.notices.map(notice => (
                <div key={notice.id} className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
                  <Link to={`/notices/${notice.id}`} className="block">
                    <p className="text-sm text-gray-500">{new Date(notice.createdAt).toLocaleDateString('ko-KR')}</p>
                    <h3 className="mt-2 text-xl font-semibold text-gray-900">{notice.title}</h3>
                  </Link>
                </div>
              ))}
            </div>
             <div className="text-center mt-12">
                <Link to="/notices" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-800">
                    더보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* 최신 치료사례 */}
      {homeData?.cases?.length > 0 && (
        <motion.section {...fadeInAnimation} className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="최신 치료사례" subtitle="연세미치과의 치료 결과를 직접 확인해보세요." />
            <div className="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {homeData.cases.map(caseItem => (
                <Link to={`/cases`} key={caseItem.id} className="group block">
                  <div className="overflow-hidden rounded-lg">
                    <img src={caseItem.beforeImageData} alt={caseItem.title} className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"/>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-indigo-600 font-semibold">{caseItem.category}</p>
                    <h3 className="mt-1 text-lg font-semibold text-gray-900 group-hover:text-indigo-700">{caseItem.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
             <div className="text-center mt-12">
                <Link to="/cases" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-800">
                    더보기 <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </div>
          </div>
        </motion.section>
      )}

      {/* 환자 후기 */}
      {homeData?.reviews?.length > 0 && (
        <motion.section {...fadeInAnimation} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SectionTitle title="환자 후기" subtitle="환자분들이 직접 남겨주신 소중한 후기입니다." />
            <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
              {homeData.reviews.map((review, index) => (
                <div key={index} className="bg-gray-50 p-8 rounded-lg">
                  <div className="flex items-center mb-4">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <p className="text-gray-600 italic">"{review.content.length > 100 ? `${review.content.substring(0, 100)}...` : review.content}"</p>
                  <p className="mt-4 font-semibold text-right">- {review.patientName} 님</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </div>
  );
};

export default HomePage;
