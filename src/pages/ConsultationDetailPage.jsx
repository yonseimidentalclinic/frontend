import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

function ConsultationDetailPage() {
  const { id } = useParams();
  const [consultation, setConsultation] = useState(null);
  const [content, setContent] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConsultation = async () => {
      try {
        const apiUrl = `${import.meta.env.VITE_API_URL}/api/consultations/${id}`;
        const response = await axios.get(apiUrl);
        setConsultation(response.data);
        if (!response.data.is_secret) {
          // 비밀글이 아니면 바로 내용 요청
          verifyPassword(''); // 비밀번호 없이 요청
        }
      } catch (err) {
        setError('해당 글을 찾을 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchConsultation();
  }, [id]);

  const verifyPassword = async (pwd) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/consultations/${id}/verify`;
      const response = await axios.post(apiUrl, { password: pwd });
      if (response.data.success) {
        setContent(response.data.consultation.content);
        setIsVerified(true);
        setError('');
      }
    } catch (err) {
      setError(err.response?.data?.message || '인증 중 오류가 발생했습니다.');
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    verifyPassword(password);
  };

  if (loading) return <div className="text-center p-10">로딩 중...</div>;
  if (error && !consultation) return <div className="text-center p-10 text-red-500">{error}</div>;

  return (
    <>
      <Helmet>
        <title>{consultation?.title || '온라인 상담'} | 연세미치과</title>
      </Helmet>
      <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-gray-800">{consultation?.title}</h1>
        <div className="flex justify-between items-center text-sm text-gray-500 my-4 border-b pb-4">
          <span>작성자: {consultation?.author}</span>
          <span>작성일: {new Date(consultation?.created_at).toLocaleDateString()}</span>
        </div>

        {isVerified ? (
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }} />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-md">
            <p className="mb-4">비밀글입니다. 내용을 보시려면 비밀번호를 입력해주세요.</p>
            <form onSubmit={handleVerify} className="flex justify-center items-center gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border rounded"
                placeholder="비밀번호"
              />
              <button type="submit" className="bg-gray-600 text-white font-semibold py-2 px-4 rounded hover:bg-gray-700">
                확인
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        )}

        <div className="mt-10 pt-6 border-t text-center">
          <Link to="/consultations" className="bg-gray-200 text-gray-800 font-semibold py-2 px-6 rounded hover:bg-gray-300">
            목록으로
          </Link>
        </div>
      </div>
    </>
  );
}

export default ConsultationDetailPage;
