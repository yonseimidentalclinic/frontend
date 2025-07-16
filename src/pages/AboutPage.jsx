// =================================================================
// 사용자용 병원소개 페이지 (AboutPage.jsx)
// 최종 업데이트: 2025년 7월 16일
// 주요 개선사항:
// 1. 서버에서 병원소개 콘텐츠를 동적으로 불러와 표시하도록 수정
// 2. 불필요한 갤러리 로직을 모두 제거하고 구조 단순화
// =================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Heart, Users, Camera } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const AboutPage = () => {
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/about`);
        setContent(response.data);
      } catch (err) {
        setError("페이지를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">페이지를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {content?.title || '연세미치과 이야기'}
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            {content?.subtitle || '환자 한 분 한 분의 건강한 미소를 위해 최선을 다합니다.'}
          </p>
        </div>
      </div>

      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            <div className="relative z-10">
              <div className="prose prose-indigo text-gray-500 mx-auto lg:max-w-none">
                <h3 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8">
                  우리의 진료 철학
                </h3>
                <p>
                  {content?.content || '내용을 준비 중입니다.'}
                </p>
              </div>
            </div>
            <div className="mt-12 relative text-base max-w-prose mx-auto lg:mt-0 lg:max-w-none">
              <img
                className="w-full rounded-lg shadow-lg aspect-[4/3] object-cover"
                src={content?.imageData || 'https://placehold.co/800x600?text=Clinic+Image'}
                alt="병원 대표 이미지"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
