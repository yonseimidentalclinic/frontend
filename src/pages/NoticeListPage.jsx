// src/pages/NoticeListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination'; // Pagination 컴포넌트 경로 확인

const NoticeListPage = () => {
  const [notices, setNotices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        const response = await api.get('/notices', {
          params: { page }
        });
        // 핵심 수정: response.data에서 items 배열을 가져와 상태를 설정합니다.
        setNotices(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [searchParams]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">병원소식</h1>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {notices && notices.length > 0 ? (
            notices.map((notice) => (
              <li key={notice.id} className="p-4 hover:bg-gray-50">
                <Link to={`/notices/${notice.id}`} className="block">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800 truncate">{notice.title}</p>
                    <span className="text-sm text-gray-500">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">등록된 게시글이 없습니다.</li>
          )}
        </ul>
      </div>
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default NoticeListPage;
