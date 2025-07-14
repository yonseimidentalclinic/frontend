// =================================================================
// 프론트엔드 진료안내 페이지 (ServicesPage.jsx)
// 파일 경로: /src/pages/ServicesPage.jsx
// =================================================================

import React from 'react';

const services = [
  { name: '임플란트', description: '자연치아와 가장 유사한 기능과 심미성을 회복하는 치료입니다. 3D CT를 이용한 정밀 진단으로 안전하고 정확한 시술을 약속합니다.' },
  { name: '치아교정', description: '삐뚤어진 치아를 가지런히 만들어 기능적, 심미적 문제를 개선합니다. 소아 교정부터 성인 교정까지 다양한 프로그램을 제공합니다.' },
  { name: '심미보철', description: '라미네이트, 올세라믹 등을 통해 변색되거나 손상된 치아를 아름답게 복원합니다. 자연스러운 색과 모양을 재현합니다.' },
  { name: '충치치료', description: '초기 충치부터 신경치료까지, 자연치아를 최대한 보존하는 원칙으로 통증 없이 편안하게 치료합니다.' },
  { name: '잇몸치료', description: '스케일링부터 잇몸 수술까지, 잇몸 질환의 원인을 찾아 근본적으로 치료하고 건강한 잇몸을 되찾아 드립니다.' },
  { name: '소아치과', description: '아이들의 눈높이에 맞춘 진료 환경에서 충치 예방과 치료를 통해 평생의 구강 건강의 기초를 다집니다.' },
];

const ServicesPage = () => {
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Services</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            전문 진료 과목
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            연세미치과는 각 분야별 전문 의료진이 협력하여 종합적인 치과 진료를 제공합니다.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.name} className="bg-white p-8 shadow-lg rounded-lg">
              <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
              <p className="mt-4 text-base text-gray-500">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
