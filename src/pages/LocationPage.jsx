// src/pages/LocationPage.jsx

import React, { useState } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

// --- 핵심 수정: 실제 병원 위치의 정확한 좌표로 다시 설정했습니다. ---
const center = {
  lat: 37.68355, // 위도
  lng: 126.77421  // 경도
};

const LocationPage = () => {
  const [infoWindowVisible, setInfoWindowVisible] = useState(true);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    language: 'ko',
  });

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
          <div className="rounded-lg shadow-lg overflow-hidden">
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={17}
              >
                <MarkerF 
                  position={center} 
                  title="연세미치과"
                  onClick={() => setInfoWindowVisible(!infoWindowVisible)}
                />

                {infoWindowVisible && (
                  <InfoWindowF
                    position={center}
                    onCloseClick={() => setInfoWindowVisible(false)}
                  >
                    <div className="p-2">
                      <h3 className="font-bold text-lg">연세미치과</h3>
                      <p className="text-sm text-gray-600 mt-1">경기 고양시 일산동구 일산로 46, 4층</p>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${center.lat},${center.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:underline mt-2 inline-block text-sm"
                      >
                        길찾기
                      </a>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            ) : (
              <div style={containerStyle} className="bg-gray-200 flex items-center justify-center">
                <p>지도를 불러오는 중입니다...</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div {...fadeInAnimation} className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="bg-gray-50 p-8 rounded-lg">
            <MapPin className="mx-auto h-10 w-10 text-indigo-600" />
            <h3 className="mt-4 text-xl font-bold text-gray-900">주소</h3>
            {/* --- 핵심 수정: 지하철 정보와 함께 상세 주소를 추가했습니다. --- */}
            <p className="mt-2 text-gray-600">
              경기 고양시 일산동구 일산로 46<br/>
              남정씨티프라자 4층 407호<br/>
              <span className="font-semibold text-indigo-600">(3호선 백석역 1번 출구)</span>
            </p>
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
              토요일: 10:00 - 14:00   점심시간 없음<br />
              (점심시간 13:00 - 14:00)
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LocationPage;
