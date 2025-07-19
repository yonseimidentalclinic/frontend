// src/pages/ConsultationListPage.jsx

import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { Lock, CheckSquare } from 'lucide-react';

const ConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const fetchConsultations = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = searchParams.get('page') || 1;
        // *** 핵심 수정: API 요청 주소를 올바른 '/consultations' (복수형)으로 변경합니다. ***
        const response = await api.get('/consultations', {
          params: { page }
        });
        
        setConsultations(response.data.items);
        setTotalPages(response.data.totalPages);
        setCurrentPage(response.data.currentPage);
      } catch (err) {
        setError('상담글을 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, [searchParams]);

  if (loading) return <div className="text-center py-20">로딩 중...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">온라인상담</h1>
        <Link to="/consultations/write" className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
          상담하기
        </Link>
      </div>
      <div className="bg-white shadow-md rounded-lg">
        <ul className="divide-y divide-gray-200">
          {consultations && consultations.length > 0 ? (
            consultations.map((item) => (
              <li key={item.id} className="p-4 hover:bg-gray-50">
                <Link to={`/consultations/${item.id}`} className="block">
                  <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                    {item.isSecret && <Lock size={16} className="text-gray-500" />}
                    <span className="truncate">{item.title}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-sm text-gray-600">{item.author}</span>
                    <div className="flex items-center gap-4">
                      {item.isAnswered && (
                        <span className="flex items-center text-sm text-blue-600 font-semibold">
                          <CheckSquare size={14} className="mr-1" /> 답변완료
                        </span>
                      )}
                      <span className="text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                  </div>
                </Link>
              </li>
            ))
          ) : (
            <li className="p-4 text-center text-gray-500">등록된 상담글이 없습니다.</li>
          )}
        </ul>
      </div>
      <div className="mt-8">
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
};

export default ConsultationListPage;
