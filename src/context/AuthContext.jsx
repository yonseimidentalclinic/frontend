// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          // --- 핵심 수정: 토큰 유효기간을 직접 확인합니다. ---
          const decodedUser = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          if (decodedUser.exp > currentTime) {
            setUser(decodedUser);
          } else {
            // 토큰이 만료되었다면 삭제합니다.
            localStorage.removeItem('userToken');
            setUser(null);
          }
        } catch (error) {
          console.error("Invalid token:", error);
          localStorage.removeItem('userToken');
          setUser(null);
        }
      }
      // 모든 확인 작업이 끝난 후에 로딩 상태를 false로 변경합니다.
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { accessToken } = response.data;
    localStorage.setItem('userToken', accessToken);
    const decodedUser = jwtDecode(accessToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* --- 핵심 수정: 로딩 중일 때는 아무것도 렌더링하지 않아 깜빡임을 방지합니다. --- */}
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
