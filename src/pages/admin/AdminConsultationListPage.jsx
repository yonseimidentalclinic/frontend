import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Pagination from '../../components/Pagination';

const AdminConsultationListPage = () => {
  const [consultations, setConsultations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchConsultations = async (page) => {
    try {
      const response = await api.get(`/consultations?page=${page}&limit=10`);
      setConsultations(response.data.consultations);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('상담 목록 로딩 실패:', error);
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
      } catch (error) {
        console.error('상담글 삭제 실패:', error);
        alert('삭제에 실패했습니다.');
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">온라인 상담 관리</h1>
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
            {consultations.map((consultation) => (
              <tr key={consultation.id}>
                <td className="px-6 py-4 whitespace-nowrap">{consultation.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{consultation.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{consultation.author}</td>
                <td className="px-6 py-4 whitespace-nowrap">{new Date(consultation.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {consultation.reply ? (
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
            ))}
          </tbody>
        </table>
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
};

export default AdminConsultationListPage;
