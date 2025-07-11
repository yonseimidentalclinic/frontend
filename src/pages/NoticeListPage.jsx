import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function NoticeListPage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/notices`;
        const response = await axios.get(apiUrl);
        setNotices(response.data);
      } catch (err) {
        setError('공지사항을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <>
      <Helmet>
        <title>병원소식 | 연세미치과</title>
        <meta name="description" content="연세미치과의 새로운 소식과 유용한 치과 상식을 확인해보세요." />
      </Helmet>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 border-b pb-4">병원 소식</h1>
        <div className="bg-white shadow-md rounded-lg">
          <ul>
            {notices.map((notice) => (
              <li key={notice.id} className="border-b last:border-b-0">
                <Link to={`/notices/${notice.id}`} className="block p-6 hover:bg-gray-50 transition duration-150">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-700 truncate">{notice.title}</h2>
                    <span className="text-sm text-gray-500 flex-shrink-0 ml-4">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default NoticeListPage;
