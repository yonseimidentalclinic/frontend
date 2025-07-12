import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

// 자물쇠 아이콘 SVG
const LockIcon = () => (
  <svg className="w-4 h-4 inline-block ml-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
  </svg>
);

function ConsultationListPage() {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/consultations`;
        const response = await axios.get(apiUrl);
        setConsultations(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;

  return (
    <>
      <Helmet>
        <title>온라인 상담 | 연세미치과</title>
        <meta name="description" content="연세미치과에 궁금한 점을 비공개로 상담하세요. 빠르고 친절하게 답변해드립니다." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">온라인 상담</h1>
          <Link to="/consultations/write" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition duration-300">
            상담 글쓰기
          </Link>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {consultations.length > 0 ? (
              consultations.map((item) => (
                <li key={item.id} className="border-b last:border-b-0">
                  <Link to={`/consultations/${item.id}`} className="block p-6 hover:bg-gray-50 transition duration-150">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <p className="text-lg font-semibold text-gray-700 truncate">{item.title}</p>
                        {item.is_secret && <LockIcon />}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-gray-600">{item.author}</p>
                        <p className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">등록된 상담 글이 없습니다.</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default ConsultationListPage;
