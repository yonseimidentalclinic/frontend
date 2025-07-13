import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '/src/services/api.js';
import Pagination from '/src/components/Pagination.jsx';
import LoadingSpinner from '/src/components/LoadingSpinner.jsx';

const AdminConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가
  const navigate = useNavigate();

  const fetchConsultations = async (page) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get(`/consultations?page=${page}&limit=10`);
      // API 응답 데이터가 배열인지 확인하여 안정성 확보
      if (Array.isArray(response.data.consultations)) {
        setConsultations(response.data.consultations);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("API did not return an array for consultations:", response.data);
        setConsultations([]);
        setError('상담 데이터를 불러오는 데 실패했습니다. 데이터 형식이 올바르지 않습니다.');
      }
    } catch (err) {
      console.error('상담 목록 로딩 실패:', err);
      setError('서버와 통신 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm('이 상담글을 정말로 삭제하시겠습니까? 답변도 함께 삭제됩니다.')) {
      try {
        await api.delete(`/consultations/${id}`);
        alert('상담글이 삭제되었습니다.');
        if (consultations.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchConsultations(currentPage);
        }
      } catch (err) {
        console.error('상담글 삭제 실패:', err);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">온라인 상담 관리</h1>
      
      {isLoading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-center text-red-500 py-10">{error}</div>
      ) : (
        <>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성자</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">작성일</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">답변상태</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {consultations.length > 0 ? consultations.map((consultation) => (
                  <tr key={consultation.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{consultation.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{consultation.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{consultation.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(consultation.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {consultation.replyId ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          답변 완료
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          대기중
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => navigate(`/admin/consultations/${consultation.id}`)}
                        className="px-3 py-1 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      >
                        답변/보기
                      </button>
                      <button
                        onClick={() => handleDelete(consultation.id)}
                        className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                )) : (
                   <tr>
                    <td colSpan="6" className="text-center py-10 text-gray-500">접수된 상담글이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
    </div>
  );
};

export default AdminConsultationListPage;
