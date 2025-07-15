// =================================================================
// 사용자용 의료진 소개 페이지 (DoctorsPage.jsx)
// 주요 개선사항:
// 1. 이미지 URL(imageUrl) 대신 이미지 데이터(imageData)를 사용하도록 수정
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const DoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/doctors`);
      if (Array.isArray(response.data)) {
        setDoctors(response.data);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      setError('의료진 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">Our Team</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl">연세미치과 의료진</p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            풍부한 경험과 따뜻한 마음으로 최상의 진료를 약속합니다.
          </p>
        </div>

        <div className="mt-12">
          {isLoading && <p className="text-center">로딩 중...</p>}
          {error && <p className="text-center text-red-500">{error}</p>}
          <ul role="list" className="space-y-12 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:space-y-0 lg:grid-cols-3 lg:gap-x-8">
            {doctors.map((doctor) => (
              <li key={doctor.id}>
                <div className="space-y-4">
                  <div className="aspect-w-3 aspect-h-2">
                    {/* [핵심 수정] imageUrl 대신 imageData 사용 */}
                    <img className="object-cover shadow-lg rounded-lg w-full h-80" src={doctor.imageData || 'https://placehold.co/400x500?text=No+Image'} alt={doctor.name} />
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg leading-6 font-medium space-y-1">
                      <h3 className="text-2xl font-bold">{doctor.name}</h3>
                      <p className="text-blue-600">{doctor.position}</p>
                    </div>
                    <div className="text-lg">
                      <ul className="list-disc list-inside text-gray-500 whitespace-pre-wrap">
                        {doctor.history && doctor.history.split('\n').map((line, index) => (
                          <li key={index}>{line}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DoctorsPage;
