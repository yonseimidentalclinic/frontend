import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps';

// 지도와 마커를 렌더링하는 부분을 별도의 컴포넌트로 분리합니다.
function LocationMap() {
  const navermaps = useNavermaps();
  // 병원의 위치 정보
  const position = new navermaps.LatLng(37.6830, 126.7634);

  return (
    <NaverMap
      defaultCenter={position}
      defaultZoom={15}
      style={{ width: '100%', height: '100%' }}
    >
      <Marker defaultPosition={position} />
    </NaverMap>
  );
}

function LocationPage() {
  return (
    <>
      <Helmet>
        <title>오시는 길 | 연세미치과</title>
        <meta name="description" content="연세미치과에 오시는 길을 안내해드립니다. 주소, 주차 정보, 대중교통 이용 방법을 확인하세요." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">오시는 길</h1>
        
        <div className="bg-white p-8 rounded-lg shadow-lg">
          {/* MapDiv가 지도를 감싸는 컨테이너 역할을 합니다. */}
          <MapDiv style={{ width: '100%', height: '400px' }} className="rounded-md mb-8">
            <LocationMap />
          </MapDiv>

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
