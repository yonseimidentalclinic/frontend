import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// 아이콘 컴포넌트
const ImplantIcon = () => (
  <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
);
const OrthodonticsIcon = () => (
  <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);
const WhiteningIcon = () => (
  <svg className="w-12 h-12 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-12v4m-2-2h4m5 4v4m-2-2h4M5 21a7 7 0 0114 0H5z"></path></svg>
);


function HomePage() {
  return (
    <>
      <Helmet>
        <title>연세미치과 - 일산 주엽동 임플란트, 치아교정 전문</title>
        <meta name="description" content="일산 주엽동에 위치한 연세미치과입니다. 최고의 의료진과 최첨단 장비로 임플란트, 치아교정, 치아미백 등 편안하고 정직한 진료를 약속합니다." />
      </Helmet>
      <div className="space-y-12 md:space-y-16">
        {/* 1. 히어로 섹션 */}
        <section className="text-center bg-blue-50 p-6 md:p-12 rounded-lg">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            환자 한 분 한 분의 미소를 소중히 여기는
          </h1>
          <p className="text-4xl md:text-5xl font-extrabold text-blue-600 mb-6">
            연세미치과
          </p>
          <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            최고의 의료진과 최첨단 장비를 통해 정확하고 편안한 진료를 약속드립니다.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-blue-600 text-white font-bold py-3 px-8 rounded-full hover:bg-blue-700 transition duration-300"
          >
            온라인 상담 문의하기
          </Link>
        </section>

        {/* 2. 핵심 진료과목 소개 */}
        <section>
          <div className="flex justify-center items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">핵심 진료과목</h2>
            {/* '더보기' 버튼 추가 */}
            <Link to="/services" className="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800">
              더보기 &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <ImplantIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">임플란트</h3>
              <p className="text-gray-600">
                자연치아와 거의 흡사한 기능과 형태로 상실된 치아를 대체합니다.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <OrthodonticsIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">치아교정</h3>
              <p className="text-gray-600">
                삐뚤어진 치열을 바로잡아 건강한 교합과 아름다운 미소를 찾아드립니다.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <WhiteningIcon />
              <h3 className="text-xl font-bold mt-4 mb-2">치아미백</h3>
              <p className="text-gray-600">
                변색된 치아를 밝고 환하게 만들어 자신감 있는 미소를 되찾아 드립니다.
              </p>
            </div>
          </div>
        </section>

        {/* 3. 병원 소식 */}
        <section>
          <div className="flex justify-center items-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">병원 소식</h2>
            {/* '더보기' 버튼 추가 */}
            <Link to="/notices" className="ml-4 text-sm font-semibold text-blue-600 hover:text-blue-800">
              더보기 &rarr;
            </Link>
          </div>
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-3xl mx-auto">
            {/* 실제 데이터는 공지사항 페이지에서 보여주므로, 여기서는 간단한 안내 문구로 대체할 수 있습니다. */}
            <p className="text-center text-gray-500">
              병원의 최신 소식과 이벤트는 '병원소식' 게시판에서 확인하실 수 있습니다.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}

export default HomePage;
