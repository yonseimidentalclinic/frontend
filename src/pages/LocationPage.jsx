import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

function LocationPage() {
  
  useEffect(() => {
    // 환경 변수에서 카카오 앱 키를 가져옵니다.
    const KAKAO_APP_KEY = import.meta.env.VITE_KAKAO_APP_KEY;

    // 디버깅을 위해 현재 사용 중인 키를 콘솔에 출력합니다.
    console.log("Using Kakao App Key:", KAKAO_APP_KEY);

    if (!KAKAO_APP_KEY) {
      console.error("Kakao App Key is not defined!");
      return;
    }

    // 카카오맵 API 스크립트를 동적으로 로드합니다.
    const script = document.createElement('script');
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false`;
    document.head.appendChild(script);

    const handleScriptLoad = () => {
      // 스크립트가 로드되면, 카카오맵 API를 사용합니다.
      window.kakao.maps.load(() => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return; // map div가 없으면 중단

        const mapOption = {
          center: new window.kakao.maps.LatLng(37.6830, 126.7634), // 병원 위치의 위도, 경도
          level: 3, // 지도의 확대 레벨
        };

        const map = new window.kakao.maps.Map(mapContainer, mapOption);

        const markerPosition = new window.kakao.maps.LatLng(37.6830, 126.7634);
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      });
    };
    
    script.addEventListener('load', handleScriptLoad);

    // 컴포넌트가 언마운트될 때 스크립트와 이벤트 리스너를 정리합니다.
    return () => {
      script.removeEventListener('load', handleScriptLoad);
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>오시는 길 | 연세미치과</title>
        <meta name="description" content="연세미치과에 오시는 길을 안내해드립니다. 주소, 주차 정보, 대중교통 이용 방법을 확인하세요." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">오시는 길</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div id="map" className="w-full h-96 rounded-md mb-8"></div>
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
