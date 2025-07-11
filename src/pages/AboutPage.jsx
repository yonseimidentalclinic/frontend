import React from 'react';

// 의료진 프로필을 위한 재사용 가능한 컴포넌트
const DoctorProfile = ({ name, specialty, imageUrl, bio }) => (
  <div className="flex flex-col md:flex-row items-center bg-white p-6 rounded-lg shadow-md gap-6">
    <img 
      src={imageUrl} 
      alt={`${name} 원장 사진`} 
      className="w-32 h-32 rounded-full object-cover flex-shrink-0"
      onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/128x128/e2e8f0/64748b?text=Image'; }}
    />
    <div>
      <h3 className="text-2xl font-bold text-blue-600">{name}</h3>
      <p className="text-md font-semibold text-gray-500 mb-2">{specialty}</p>
      <p className="text-gray-700">{bio}</p>
    </div>
  </div>
);

function AboutPage() {
  return (
    <div className="space-y-16">
      {/* 1. 원장 인사말 섹션 */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">인사말</h2>
        <div className="bg-white p-10 rounded-lg shadow-lg">
          <p className="text-5xl text-blue-500 font-serif leading-tight mb-4">“</p>
          <p className="text-lg text-gray-700 mb-4">
            저희 연세미치과 홈페이지를 찾아주신 모든 분들께 진심으로 감사드립니다.
          </p>
          <p className="text-gray-600 leading-relaxed">
            언제나 환자분들의 입장에서 먼저 생각하고, 불필요한 과잉 진료 없이 정직하고 양심적인 진료를 약속드립니다. 저희는 단순한 치과 치료를 넘어, 환자분들의 평생 구강 건강을 함께 책임지는 든든한 동반자가 되고자 합니다. 최신 디지털 장비와 끊임없는 연구를 통해 보다 정확하고 편안한 진료를 제공하기 위해 항상 노력하겠습니다.
          </p>
          <p className="text-right mt-6 font-semibold text-gray-800">연세미치과 원장 박건현</p>
        </div>
      </section>

      {/* 2. 의료진 소개 섹션 */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">의료진 소개</h2>
        <div className="space-y-8">
          <DoctorProfile 
            name="박건현 원장"
            specialty="통합치의학과 전문의"
            imageUrl="https://placehold.co/128x128/a3e635/44403c?text=원장님"
            bio="연세대학교 치과대학 졸업. 보건복지부 인증 통합치의학과 전문의. 다수의 임플란트 및 보철 치료 경험을 바탕으로 환자 맞춤형 진료를 제공합니다."
          />
          {/* 다른 의료진이 있다면 여기에 DoctorProfile 컴포넌트를 추가하면 됩니다. */}
        </div>
      </section>

      {/* 3. 병원 둘러보기 섹션 */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">병원 둘러보기</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <img src="https://placehold.co/600x400/bfdbfe/1e3a8a?text=대기실" alt="병원 대기실" className="rounded-lg shadow-md w-full h-full object-cover" />
          <img src="https://placehold.co/600x400/bfdbfe/1e3a8a?text=진료실" alt="병원 진료실" className="rounded-lg shadow-md w-full h-full object-cover" />
          <img src="https://placehold.co/600x400/bfdbfe/1e3a8a?text=상담실" alt="병원 상담실" className="rounded-lg shadow-md w-full h-full object-cover" />
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
