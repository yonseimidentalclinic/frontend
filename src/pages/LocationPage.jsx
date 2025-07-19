// =================================================================
// 프론트엔드 오시는 길 페이지 (LocationPage.jsx)
// 파일 경로: /src/pages/LocationPage.jsx
// =================================================================

import React, { useEffect } from 'react';

const LocationPage = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${import.meta.env.VITE_NAVER_MAP_CLIENT_ID}`;
    document.head.appendChild(script);

    script.onload = () => {
      const mapOptions = {
        center: new window.naver.maps.LatLng(37.5665, 126.9780), // 서울 시청 기본 위치
        zoom: 17,
      };
      const map = new window.naver.maps.Map('map', mapOptions);
      
      new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(37.5665, 126.9780),
        map: map,
      });
    };
    
    return () => {
      // 컴포넌트 언마운트 시 스크립트 제거 (선택적)
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800">오시는 길</h1>
        <p className="text-gray-500 mt-2">연세미치과를 찾아주셔서 감사합니다.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* 지도 표시 영역 */}
        <div id="map" style={{ width: '100%', height: '400px' }} className="rounded-lg shadow-md">
          <div className="flex items-center justify-center h-full bg-gray-100 text-gray-500">
            지도 로딩 중...
          </div>
        </div>

        {/* 주소 및 교통 정보 */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">병원 정보</h2>
          <div className="space-y-4 text-lg">
            <p><strong>주소:</strong> 경기 고양시 일산동구 일산로 46 남정씨티 프라자 4층 407호</p>
            <p><strong>전화:</strong> 031-905-7285</p>
            <p><strong>팩스:</strong> 031-905-7286</p>
            <p><strong>진료시간:</strong></p>
            <ul className="list-disc list-inside pl-4 text-base">
              <li>평일: 10:00 - 18:30</li>
              <li>토요일: 10:00 - 14:00 (점심시간 없음)</li>
              <li>점심시간: 13:00 - 14:00</li>
              <li>일요일/공휴일: 휴진</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationPage;
