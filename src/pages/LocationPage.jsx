// src/pages/LocationPage.jsx

import React, { useEffect, useRef } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationPage = () => {
  // --- 핵심: React가 지도를 그릴 div 요소를 기억하게 만듭니다. ---
  const mapElement = useRef(null);

  useEffect(() => {
    // --- 핵심: 페이지가 처음 나타날 때 딱 한 번만 실행됩니다. ---
    
    // VITE_NAVER_MAP_CLIENT_ID는 .env.local 파일에 정의되어 있어야 합니다.
    // 예: VITE_NAVER_MAP_CLIENT_ID=여기에실제ID입력
    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID || '83bfuniegk'; // 임시 ID

    // 네이버 지도 스크립트를 동적으로 불러옵니다.
    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapClientId}`;
    script.async = true;
    
    // 스크립트 로딩이 완료되면 지도를 초기화하는 함수를 실행합니다.
    script.onload = () => initMap();
    
    document.head.appendChild(script);

    return () => {
      // 페이지를 벗어날 때 스크립트를 정리합니다.
      document.head.removeChild(script);
    };
  }, []); // 빈 배열 []은 이 코드가 단 한 번만 실행되도록 보장합니다.

  const initMap = () => {
    // 지도 div나 naver maps API가 준비되지 않았다면 실행하지 않습니다.
    if (!mapElement.current || !window.naver) return;

    // 병원 위치 좌표 (예: 신촌역)
    const location = new window.naver.maps.LatLng(37.5552, 126.9369);
    
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    // --- 핵심: 기억해둔 div에 지도를 생성합니다. ---
    const map = new window.naver.maps.Map(mapElement.current, mapOptions);

    // 지도에 마커를 표시합니다.
    new window.naver.maps.Marker({
      position: location,
      map: map,
      title: '연세미치과',
    });
  };

  const fadeInAnimation = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <motion.div {...fadeInAnimation} className="text-center mb-16">
          <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">오시는 길</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl">
            연세미치과를 찾아주셔서 감사합니다.
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            대중교통을 이용하시면 더욱 편리하게 방문하실 수 있습니다.
          </p>
        </motion.div>

        <motion.div {...fadeInAnimation}>
          {/* --- 핵심: ref 속성으로 이 div를 React가 기억하게 합니다. --- */}
          <div ref={mapElement} style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-lg" />
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <MapPin className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">주소</h3>
            <p className="mt-2 text-gray-600">경기 고양시 일산동구 일산로 46 남정씨티프라자 4층 407호 연세미치과</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <Phone className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">전화번호</h3>
            <p className="mt-2 text-gray-600">031-905-7285</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <Clock className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">진료시간</h3>
            <p className="mt-2 text-gray-600">
              평일: 10:00 - 18:30<br />
              토요일: 10:00 - 14:00 점심시간 없음<br />
              (점심시간 13:00 - 14:00)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationPage;
