import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function NoticeDetailPage() {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/notices/${id}`;
        const response = await axios.get(apiUrl);
        setNotice(response.data);
      } catch (err) {
        setError('해당 공지사항을 찾을 수 없습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!notice) return null;

  return (
    <>
      <Helmet>
        <title>{notice.title} | 연세미치과</title>
        <meta name="description" content={notice.content.substring(0, 150)} />
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{notice.title}</h1>
        <p className="text-sm text-gray-500 mb-8 border-b pb-4">
          작성일: {new Date(notice.created_at).toLocaleDateString()}
        </p>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: notice.content.replace(/\n/g, '<br />') }} />
        <div className="mt-10 pt-6 border-t text-center">
          <Link to="/notices" className="inline-block bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-300 transition duration-300">
            목록으로
          </Link>
        </div>
      </div>
    </>
  );
}

export default NoticeDetailPage;
