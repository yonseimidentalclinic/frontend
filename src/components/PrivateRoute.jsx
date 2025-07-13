import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // localStorage에서 'adminToken'을 확인합니다.
  const token = localStorage.getItem('adminToken');

  // 토큰이 존재하면, 자식 라우트(관리자 페이지들)를 보여줍니다.
  // 토큰이 없으면, 로그인 페이지로 강제 이동시킵니다.
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default PrivateRoute;