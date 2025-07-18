// =================================================================
// 관리자 접근 기록 페이지 (AdminLogsPage.jsx)
// 파일 경로: /src/pages/admin/AdminLogsPage.jsx
// 주요 기능:
// 1. 서버에서 관리자 로그인 기록을 불러와 최신순으로 표시
// 2. 접속 시간, 활동(로그인 성공), 접속 IP 주소를 테이블 형태로 보여줌
// =================================================================

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const AdminLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/api/admin/logs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError('접근 기록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const renderContent = () => {
    if (isLoading) return <p className="p-4 text-center">로딩 중...</p>;
    if (error) return <p className="p-4 text-center text-red-500">{error}</p>;
    if (logs.length === 0) return <p className="p-4 text-center text-gray-500">접근 기록이 없습니다.</p>;

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">시간</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">활동</th>
              <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">접속 IP 주소</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {logs.map(log => (
              <tr key={log.id} className="border-b">
                <td className="py-3 px-4">{formatDate(log.createdAt)}</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {log.action === 'login_success' ? '로그인 성공' : log.action}
                  </span>
                </td>
                <td className="py-3 px-4">{log.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">관리자 접근 기록</h1>
        <div className="bg-white rounded-lg shadow-md">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLogsPage;
