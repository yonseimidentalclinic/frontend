// src/pages/AboutPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AboutPage = () => {
  const [about, setAbout] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const aboutPromise = api.get('/about');
        const photosPromise = api.get('/clinic-photos'); // 페이지네이션 없이 모든 사진을 가져오도록 요청할 수 있습니다.
        const [aboutResponse, photosResponse] = await Promise.all([aboutPromise, photosPromise]);
        
        setAbout(aboutResponse.data);
        setPhotos(photosResponse.data.photos); // public API는 { photos: [...] } 형태로 응답
      } catch (err) {
        setError('페이지 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!about) return null;

  return (
    <div>
      {/* 상단 소개 섹션 */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-indigo-600 tracking-wide uppercase">Our Story</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              {about.title}
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              {about.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* 본문 내용 및 대표 이미지 */}
      <div className="py-16 bg-gray-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 space-y-8 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-start">
            <div className="relative z-10">
              <div className="prose prose-indigo text-gray-500 mx-auto lg:max-w-none"
                   dangerouslySetInnerHTML={{ __html: about.content }} />
            </div>
            {about.imageData && (
              <div className="mt-12 relative text-base mx-auto max-w-prose lg:max-w-none">
                <figure>
                  <div className="aspect-w-12 aspect-h-7 lg:aspect-none">
                    <img
                      className="rounded-lg shadow-lg object-cover object-center"
                      src={about.imageData}
                      alt="병원 대표 이미지"
                      width={1184}
                      height={1376}
                    />
                  </div>
                </figure>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* [새 기능] 병원 둘러보기 갤러리 */}
      {photos.length > 0 && (
        <div className="bg-white py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">병원 둘러보기</h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                환자분들을 위해 준비된 쾌적하고 편안한 공간을 소개합니다.
              </p>
            </div>
            <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
              {photos.map((photo) => (
                <article key={photo.id} className="flex flex-col items-start justify-between">
                  <div className="relative w-full">
                    <img
                      src={photo.imageData}
                      alt={photo.caption || '병원 사진'}
                      className="aspect-[16/9] w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="max-w-xl">
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        {photo.caption || '병원 시설'}
                      </h3>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutPage;
