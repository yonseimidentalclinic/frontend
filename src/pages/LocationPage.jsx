import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

function LocationPage() {
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    // 이미 카카오맵 스크립트가 로드되어 있는지 확인
    if (window.kakao && window.kakao.maps) {
      setMapLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    script.async = true;
    
    script.onload = () => {
      window.kakao.maps.load(() => {
        setMapLoaded(true);
      });
    };
    
    script.onerror = () => {
      console.error("카카오맵 스크립트를 불러오는 데 실패했습니다.");
    };

    document.head.appendChild(script);

    return () => {
      // 컴포넌트가 사라질 때 스크립트 태그를 정리할 수 있지만,
      // 다른 페이지에서도 지도를 사용할 수 있으므로 굳이 지우지 않아도 됩니다.
    };
  }, []);

  useEffect(() => {
    // 스크립트 로딩 및 API 준비가 완료되면 지도를 그립니다.
    if (mapLoaded) {
      const mapContainer = document.getElementById('map');
      if (!mapContainer) return;

      const mapOption = {
        center: new window.kakao.maps.LatLng(37.6830, 126.7634),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);
      
      const markerPosition = new window.kakao.maps.LatLng(37.6830, 126.7634);
      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
      });
      marker.setMap(map);
    }
  }, [mapLoaded]); // mapLoaded 상태가 true로 바뀌면 이 useEffect가 실행됩니다.

  return (
    <>
      <Helmet>
        <title>오시는 길 | 연세미치과</title>
        <meta name="description" content="연세미치과에 오시는 길을 안내해드립니다. 주소, 주차 정보, 대중교통 이용 방법을 확인하세요." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">오시는 길</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* 이 div에 카카오맵이 그려집니다. */}
          <div id="map" className="w-full h-96 rounded-md mb-8">
            {!mapLoaded && <p className="flex items-center justify-center h-full text-gray-500">지도를 불러오는 중입니다...</p>}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-3">주소 안내</h2>
              <p className="text-gray-700">경기도 고양시 일산서구 주엽로 150</p>
              <p className="text-gray-700">(주엽동, 문촌마을 1단지 상가)</p>
            </div>
            <div>
              <h2 className="text-xl font-bold text-blue-600 mb-3">주차 안내</h2>
              <p className="text-gray-700">상가 건물 지하 주차장을 이용하실 수 있습니다.</p>
              <p className="text-gray-700">(진료 시 주차권 제공)</p>
            </div>
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-blue-600 mb-3">대중교통 안내</h2>
              <p className="text-gray-700"><strong className="font-semibold">지하철:</strong> 3호선 주엽역 1번 출구에서 도보 5분</p>
              <p className="text-gray-700"><strong className="font-semibold">버스:</strong> '문촌마을' 또는 '주엽역' 정류장 하차</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LocationPage;
