import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function AdminConsultationDetailPage() {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultation = async () => {
      const token = localStorage.getItem('adminToken');
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/consultations/${id}`;
        const response = await axios.get(apiUrl, { headers: { 'Authorization': `Bearer ${token}` } });
        setConsultation(response.data);
        setReply(response.data.reply || '');
      } catch (error) {
        console.error("Failed to fetch consultation details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/admin/consultations/${id}/reply`;
      await axios.post(apiUrl, { reply }, { headers: { 'Authorization': `Bearer ${token}` } });
      alert('답변이 성공적으로 등록되었습니다.');
      // Optionally, refresh the data
      const updatedResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/consultations/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
      setConsultation(updatedResponse.data);
    } catch (error) {
      alert('답변 등록에 실패했습니다.');
      console.error("Failed to submit reply", error);
    }
  };
  
  if (loading) return <div>로딩 중...</div>;
  if (!consultation) return <div>상담 내용을 찾을 수 없습니다.</div>;

  return (
    <>
      <Helmet><title>'{consultation.title}' 상담 상세 | 연세미치과</title></Helmet>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-2">{consultation.title}</h1>
        <div className="text-sm text-gray-500 mb-6 pb-4 border-b">
          <span>작성자: {consultation.author}</span> | <span>작성일: {new Date(consultation.created_at).toLocaleDateString()}</span>
        </div>
        <div className="mb-8">
          <h3 className="font-semibold mb-2">상담 내용</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{consultation.content}</p>
        </div>
        <form onSubmit={handleReplySubmit}>
          <h3 className="font-semibold mb-2">답변 작성</h3>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows="8"
            className="w-full p-2 border rounded"
            placeholder="답변을 입력하세요..."
          />
          <div className="flex justify-end mt-4">
            <Link to="/admin/consultations" className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded mr-2">목록으로</Link>
            <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded">답변 저장</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default AdminConsultationDetailPage;
