// src/pages/LocationPage.jsx

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const LocationPage = () => {
  const mapElement = useRef(null);
  const [mapError, setMapError] = useState(null);
  // 스크립트 로딩 상태를 관리하여 중복 실행을 방지합니다.
  const scriptLoaded = useRef(false);

  useEffect(() => {
    // .env.local 파일 또는 Vercel 환경 변수에 정의된 Client ID를 가져옵니다.
    const naverMapClientId = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

    if (!naverMapClientId) {
      setMapError("네이버 지도 Client ID가 설정되지 않았습니다. 관리자에게 문의하세요.");
      return;
    }

    // 스크립트가 이미 로딩되었다면 함수를 종료합니다.
    if (scriptLoaded.current) {
      initMap(naverMapClientId);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${naverMapClientId}`;
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      initMap(naverMapClientId);
    };
    script.onerror = () => {
      setMapError("네이버 지도 스크립트를 불러오는 데 실패했습니다.");
    };
    
    document.head.appendChild(script);

    return () => {
      // 컴포넌트가 사라질 때 스크립트 태그를 제거할 수 있습니다.
      // document.head.removeChild(script);
    };
  }, []);

  const initMap = (clientId) => {
    if (!mapElement.current || !window.naver || !window.naver.maps) {
      setMapError("지도 초기화에 필요한 리소스가 준비되지 않았습니다.");
      return;
    };

    const location = new window.naver.maps.LatLng(37.5552, 126.9369); // 신촌역 좌표
    
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: window.naver.maps.Position.TOP_RIGHT,
      },
    };

    try {
      const map = new window.naver.maps.Map(mapElement.current, mapOptions);

      new window.naver.maps.Marker({
        position: location,
        map: map,
        title: '연세미치과',
      });
    } catch (error) {
        // ID나 URL 인증 오류 발생 시 여기서 에러를 잡습니다.
        console.error("Map creation error:", error);
        setMapError("지도 인증에 실패했습니다. Client ID와 등록된 URL을 확인해주세요.");
    }
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
          <div ref={mapElement} style={{ width: '100%', height: '500px' }} className="rounded-lg shadow-lg bg-gray-200 flex items-center justify-center">
            {mapError && <p className="text-red-500 font-semibold px-4 text-center">{mapError}</p>}
          </div>
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <MapPin className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">주소</h3>
            <p className="mt-2 text-gray-600">서울특별시 서대문구 연세로 50</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <Phone className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">전화번호</h3>
            <p className="mt-2 text-gray-600">02-1234-5678</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-lg">
            <Clock className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">진료시간</h3>
            <p className="mt-2 text-gray-600">
              평일: 09:30 - 18:30<br />
              토요일: 09:30 - 14:00<br />
              (점심시간 13:00 - 14:00)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationPage;
