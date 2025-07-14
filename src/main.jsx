// =================================================================
// 프론트엔드 메인 페이지 (MainPage.jsx)
// 파일 경로: /src/pages/MainPage.jsx
// 주요 기능:
// 1. 병원의 메인 랜딩 페이지 역할
// 2. 병원의 핵심 가치와 서비스 바로가기 링크 제공
// =================================================================

import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Smile } from 'lucide-react';

const MainPage = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-blue-50">
        <div className="max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            <span className="block">환자 중심의 진료,</span>
            <span className="block text-blue-600">연세미치과가 함께합니다.</span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-gray-500 sm:max-w-3xl">
            최고의 의료진과 최첨단 장비로 환자 한 분 한 분의 미소를 되찾아 드리는 것에 최선을 다합니다.
          </p>
          <div className="mt-10 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
            <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
              <Link
                to="/about"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 sm:px-8"
              >
                병원소개
              </Link>
              <Link
                to="/location"
                className="flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-blue-600 bg-white hover:bg-gray-50 sm:px-8"
              >
                오시는 길
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Our Values</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              연세미치과의 약속
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              저희는 아래 세 가지 가치를 바탕으로 환자분들을 대합니다.
            </p>
          </div>

          <div className="mt-10">
            <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Stethoscope className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">전문적인 진료</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  분야별 최고의 의료진이 검증된 기술과 최신 장비를 통해 정확하고 안전한 진료를 제공합니다.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Heart className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">따뜻한 공감</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  환자분의 마음에 공감하며, 작은 불편함까지도 세심하게 살피는 따뜻한 소통을 약속합니다.
                </dd>
              </div>

              <div className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <Smile className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">만족스러운 결과</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  과잉 진료 없이 꼭 필요한 치료만을 정직하게 시행하여, 건강하고 아름다운 미소를 되찾아 드립니다.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
