// =================================================================
// 프론트엔드 병원소개 페이지 (AboutPage.jsx)
// 파일 경로: /src/pages/AboutPage.jsx
// =================================================================

import React from 'react';
import { Camera, Heart, Users } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            연세미치과 이야기
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            환자 한 분 한 분의 건강한 미소를 위해, 저희는 보이지 않는 곳까지 정성을 다합니다.
          </p>
        </div>
      </div>

      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="text-base max-w-prose mx-auto lg:max-w-none">
            <h3 className="text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              우리의 진료 철학
            </h3>
          </div>
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            <div className="relative z-10">
              <div className="prose prose-indigo text-gray-500 mx-auto lg:max-w-none">
                <p>
                  연세미치과는 단순히 아픈 곳을 치료하는 것을 넘어, 환자분들의 삶의 질을 높이는 것을 목표로 합니다. 저희는 과잉 진료를 지양하고, 꼭 필요한 치료만을 정직하게 권해드립니다. 모든 진료는 과학적 근거에 기반하여 이루어지며, 환자분과의 충분한 소통을 통해 가장 적합한 치료 계획을 함께 만들어갑니다.
                </p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Heart className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="ml-3">
                      <strong>환자 중심:</strong> 모든 의사결정의 중심에는 환자가 있습니다.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="ml-3">
                      <strong>전문 의료진:</strong> 분야별 전문성을 갖춘 의료진이 협력하여 최상의 결과를 만듭니다.
                    </p>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0">
                      <Camera className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="ml-3">
                      <strong>첨단 장비:</strong> 디지털 장비를 활용하여 정확하고 안전한 진료를 약속합니다.
                    </p>
                  </li>
                </ul>
                <p className="mt-8">
                  언제나 편안하고 신뢰할 수 있는 진료 환경을 제공하기 위해, 연세미치과의 모든 구성원은 끊임없이 배우고 노력하겠습니다.
                </p>
              </div>
            </div>
            <div className="mt-12 relative text-base max-w-prose mx-auto lg:mt-0 lg:max-w-none">
              <img
                className="w-full rounded-lg shadow-lg"
                src="/images/clinic.jpg"
                alt="진료실 이미지"
                width={1184}
                height={1376}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
