import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  // 브라우저의 localStorage에서 'adminToken'을 찾아봅니다.
  const token = localStorage.getItem('adminToken');

  // 토큰이 있으면, 요청한 페이지(Outlet)를 그대로 보여줍니다.
  // 토큰이 없으면, 로그인 페이지로 강제로 이동시킵니다.
  return token ? <Outlet /> : <Navigate to="/admin/login" replace />;
}

export default PrivateRoute;
