import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api'; // 원장님의 기존 api 서비스 파일을 그대로 사용합니다.
import { jwtDecode } from 'jwt-decode';

// 1. Context 생성 및 커스텀 훅 정의
const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// 2. AuthProvider 컴포넌트 정의
export const AuthProvider = ({ children }) => {
  // --- 상태 관리 (State Management) ---
  const [user, setUser] = useState(null); // 로그인한 사용자 정보 {id, email, ...}
  const [isAdmin, setIsAdmin] = useState(false); // ★ 관리자 권한 여부 상태 추가
  const [loading, setLoading] = useState(true); // 인증 정보 로딩 상태

  // --- 효과 (Effects) ---
  // 앱이 처음 시작될 때, localStorage에 저장된 토큰을 확인하여 자동으로 로그인 처리합니다.
  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const decodedUser = jwtDecode(token);

        // ★ 중요: 토큰 만료 시간 확인 로직 추가
        if (decodedUser.exp * 1000 > Date.now()) {
          // 토큰이 유효하면 사용자 정보와 권한을 설정하고,
          // api 인스턴스에 인증 헤더를 기본값으로 설정합니다.
          setUser(decodedUser);
          setIsAdmin(decodedUser.isAdmin || false); // 토큰에 isAdmin 속성이 있는지 확인
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // 토큰이 만료되었다면 제거합니다.
          localStorage.removeItem('userToken');
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem('userToken');
      }
    }
    // 모든 인증 확인 절차가 끝나면 로딩 상태를 false로 변경합니다.
    setLoading(false);
  }, []);

  // --- 인증 함수 (Auth Functions) ---

  // 로그인 함수
  const login = async (email, password) => {
    // api 서비스를 통해 백엔드에 로그인 요청을 보냅니다.
    const response = await api.post('/auth/login', { email, password });
    const { accessToken } = response.data; // 백엔드에서 'accessToken'으로 토큰을 보낸다고 가정

    // 토큰을 localStorage에 저장합니다.
    localStorage.setItem('userToken', accessToken);
    // api 인스턴스의 기본 헤더에 인증 토큰을 추가합니다.
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

    // 토큰을 디코딩하여 사용자 정보와 권한을 상태에 저장합니다.
    const decodedUser = jwtDecode(accessToken);
    setUser(decodedUser);
    setIsAdmin(decodedUser.isAdmin || false); // ★ 관리자 권한 설정
  };

  // 회원가입 함수 (기능 확장을 위해 추가)
  const register = async (userData) => {
    // api 서비스를 통해 백엔드에 회원가입 요청을 보냅니다.
    await api.post('/auth/register', userData);
    // 필요하다면 회원가입 후 바로 로그인 처리도 가능합니다.
    // await login(userData.email, userData.password);
  };

  // 로그아웃 함수
  const logout = () => {
    // localStorage에서 토큰을 제거합니다.
    localStorage.removeItem('userToken');
    // 모든 관련 상태를 초기화합니다.
    setUser(null);
    setIsAdmin(false); // ★ 관리자 권한 초기화
    // api 인스턴스의 기본 헤더에서 인증 정보를 제거합니다.
    delete api.defaults.headers.common['Authorization'];
  };

  // --- Context 값 제공 ---
  // Provider를 통해 앱 전체에 공유할 값들을 정의합니다.
  const value = {
    user,
    isAdmin, // ★ 관리자 여부
    loading,
    login,
    logout,
    register, // ★ 회원가입 함수
  };

  return (
    <AuthContext.Provider value={value}>
      {/* 로딩이 완료된 후에만 자식 컴포넌트들을 렌더링합니다. */}
      {!loading && children}
    </AuthContext.Provider>
  );
};
