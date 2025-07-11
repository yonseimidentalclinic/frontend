import React, { useState } from 'react';

// 각 진료과목의 내용을 담고 있는 데이터 객체
const servicesData = {
  implant: {
    title: '디지털 임플란트',
    description: '3D CT와 구강 스캐너를 이용한 정밀 진단으로, 최소 절개와 빠른 회복이 가능한 디지털 임플지 임플란트입니다.',
    imageUrl: 'https://placehold.co/800x400/dbeafe/1e3a8a?text=임플란트+시술',
    details: [
      {
        title: '정확한 식립 위치 계획',
        content: '컴퓨터 모의 수술을 통해 신경 위치, 골조직 등을 미리 파악하여 가장 안전하고 정확한 위치에 임플란트를 식립합니다.'
      },
      {
        title: '최소 절개 및 통증 감소',
        content: '네비게이션 임플란트 방식을 통해 잇몸 절개를 최소화하여 출혈과 통증이 적고 회복이 빠릅니다.'
      },
      {
        title: '맞춤형 보철물 제작',
        content: '환자 개개인의 구강 구조에 꼭 맞는 맞춤형 보철물을 제작하여 뛰어난 심미성과 저작 기능을 제공합니다.'
      }
    ]
  },
  orthodontics: {
    title: '투명교정 & 설측교정',
    description: '눈에 잘 띄지 않는 장치를 사용하여 심미성을 높인 교정 치료로, 자신감 있는 교정 기간을 보낼 수 있습니다.',
    imageUrl: 'https://placehold.co/800x400/dbeafe/1e3a8a?text=치아교정',
    details: [
      {
        title: '인비절라인 투명교정',
        content: '탈부착이 가능한 투명한 교정 장치로, 위생적이고 심미성이 뛰어나며 중요한 날에는 잠시 빼놓을 수 있습니다.'
      },
      {
        title: '클리피씨(Clippy-C) 교정',
        content: '치아 색과 유사한 브라켓과 자가결찰 방식을 사용하여 통증이 적고 치료 기간을 단축시키는 효과가 있습니다.'
      },
      {
        title: '설측교정',
        content: '교정 장치를 치아 안쪽에 부착하여 겉으로 전혀 보이지 않아 다른 사람 모르게 교정이 가능합니다.'
      }
    ]
  },
  whitening: {
    title: '전문가 치아미백',
    description: '안전성이 입증된 고농도 미백제를 사용하여 치과에서 직접 시술하는 방식으로, 빠르고 효과적인 미백 효과를 볼 수 있습니다.',
    imageUrl: 'https://placehold.co/800x400/dbeafe/1e3a8a?text=치아미백',
    details: [
      {
        title: '원데이 미백 프로그램',
        content: '단 하루의 내원으로도 만족스러운 미백 효과를 얻을 수 있어 결혼이나 면접 등 중요한 일정을 앞둔 분들께 추천합니다.'
      },
      {
        title: '안전한 시술',
        content: '치과 의사의 정확한 진단 하에 잇몸 보호제를 도포한 후 안전하게 시술하여 시린 증상과 부작용을 최소화합니다.'
      },
      {
        title: '효과적인 색소 분해',
        content: '특수 광선을 미백제에 조사하여 활성화시켜 치아 깊숙이 침투한 색소를 효과적으로 분해하고 제거합니다.'
      }
    ]
  }
};

function ServicesPage() {
  // 'implant'를 기본으로 선택된 탭으로 설정
  const [activeTab, setActiveTab] = useState('implant');
  const activeService = servicesData[activeTab];

  const tabButtonClasses = (tabName) => 
    `px-6 py-3 text-lg font-semibold rounded-t-lg focus:outline-none ` +
    (activeTab === tabName 
      ? 'bg-white text-blue-600 border-b-2 border-blue-600' 
      : 'bg-gray-100 text-gray-500 hover:bg-gray-200');

  return (
    <div>
      {/* 탭 메뉴 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-2" aria-label="Tabs">
          <button onClick={() => setActiveTab('implant')} className={tabButtonClasses('implant')}>
            임플란트
          </button>
          <button onClick={() => setActiveTab('orthodontics')} className={tabButtonClasses('orthodontics')}>
            치아교정
          </button>
          <button onClick={() => setActiveTab('whitening')} className={tabButtonClasses('whitening')}>
            치아미백
          </button>
        </nav>
      </div>

      {/* 선택된 탭 내용 */}
      <div className="mt-8 bg-white p-8 rounded-b-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{activeService.title}</h2>
        <p className="text-gray-600 mb-8">{activeService.description}</p>
        <img src={activeService.imageUrl} alt={activeService.title} className="rounded-lg mb-8 w-full" />
        
        <div className="space-y-6">
          {activeService.details.map((detail, index) => (
            <div key={index}>
              <h3 className="text-xl font-bold text-blue-600 mb-2">{detail.title}</h3>
              <p className="text-gray-700">{detail.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ServicesPage;
