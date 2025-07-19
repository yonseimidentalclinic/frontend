// src/pages/NoticeDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft } from 'lucide-react';

const NoticeDetailPage = () => {
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchNotice = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/notices/${id}`);
        setNotice(response.data);
      } catch (err) {
        setError('게시글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotice();
  }, [id]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;
  if (!notice) return <div className="text-center py-20">게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-8 border-b">
            <h1 className="text-3xl font-bold text-slate-800">{notice.title}</h1>
            <p className="text-sm text-slate-500 mt-2">
              작성일: {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
            </p>
          </div>
          {/* --- 핵심 수정: dangerouslySetInnerHTML을 사용하여 HTML을 렌더링합니다. --- */}
          <div
            className="p-8 prose max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/notices" 
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-300 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            목록으로
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
