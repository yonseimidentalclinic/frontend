// src/pages/admin/AdminUserListPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';
import { KeyRound } from 'lucide-react';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (err) {
      setError('회원 목록을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleResetPassword = async (userId, username) => {
    const newPassword = window.prompt(`'${username}' 님의 새로운 비밀번호를 입력하세요.`);
    if (newPassword === null) return; // 사용자가 '취소'를 누른 경우
    if (!newPassword || newPassword.length < 4) {
      alert('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/reset-password`, { newPassword });
      alert(`'${username}' 님의 비밀번호가 성공적으로 초기화되었습니다.`);
    } catch (err) {
      alert('비밀번호 초기화에 실패했습니다.');
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center">로딩 중...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6 md:p-8">
      <h1 className="text-3xl font-bold mb-6">회원 관리</h1>
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">회원 ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">관리</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.id}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button 
                    onClick={() => handleResetPassword(user.id, user.username)} 
                    className="text-yellow-600 hover:text-yellow-800 p-2 rounded-full hover:bg-yellow-100"
                    title="비밀번호 초기화"
                  >
                    <KeyRound size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUserListPage;
