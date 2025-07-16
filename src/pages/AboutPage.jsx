// =================================================================
// 사용자용 병원소개 페이지 (AboutPage.jsx)
// 최종 업데이트: 2025년 7월 16일
// 주요 개선사항:
// 1. 서버에서 병원소개 글과 병원 사진 갤러리를 모두 불러와서 표시
// 2. 기존의 정적 내용을 동적 콘텐츠로 변경
// =================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AboutPage = () => {
  const [aboutContent, setAboutContent] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // 병원소개글과 갤러리 사진을 동시에 요청합니다.
        const [aboutRes, photosRes] = await Promise.all([
          axios.get(`${API_URL}/api/about`),
          axios.get(`${API_URL}/api/clinic-photos`)
        ]);

        setAboutContent(aboutRes.data);
        setPhotos(Array.isArray(photosRes.data) ? photosRes.data : []);

      } catch (err) {
        console.error("페이지 데이터를 불러오는 중 오류 발생:", err);
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
      {/* 상단 소개 섹션 */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            {aboutContent?.title || '연세미치과 이야기'}
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            {aboutContent?.subtitle || '환자 한 분 한 분의 건강한 미소를 위해 최선을 다합니다.'}
          </p>
        </div>
      </div>

      {/* 본문 및 메인 이미지 섹션 */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            <div className="relative z-10">
              <div className="prose prose-indigo text-gray-500 mx-auto lg:max-w-none">
                <h3 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-8">
                  우리의 진료 철학
                </h3>
                <p className="whitespace-pre-wrap">
                  {aboutContent?.content || '내용을 준비 중입니다.'}
                </p>
              </div>
            </div>
            <div className="mt-12 relative text-base max-w-prose mx-auto lg:mt-0 lg:max-w-none">
              <img
                className="w-full rounded-lg shadow-lg aspect-[4/3] object-cover"
                src={aboutContent?.imageData || 'https://placehold.co/800x600?text=Clinic+Image'}
                alt="병원 대표 이미지"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 병원 사진 갤러리 섹션 */}
      {photos.length > 0 && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">
              병원 둘러보기
            </h2>
            <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:gap-x-8">
              {photos.map((photo) => (
                <div key={photo.id} className="group">
                  <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={photo.imageData}
                      alt={photo.caption || '병원 사진'}
                      className="w-full h-full object-center object-cover group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{photo.caption}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
