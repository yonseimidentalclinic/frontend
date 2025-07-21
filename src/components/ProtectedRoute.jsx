import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * 보호된 경로(ProtectedRoute) 컴포넌트
 * 사용자의 로그인 상태와 역할(관리자 여부)에 따라 접근을 제어합니다.
 * * @param {object} props - 컴포넌트 프로퍼티
 * @param {boolean} [props.adminOnly=false] - 이 경로가 관리자 전용인지 여부
 */
const ProtectedRoute = ({ adminOnly = false }) => {
  // 1. AuthContext에서 사용자 정보와 권한, 로딩 상태를 가져옵니다.
  // ※ AuthContext에 user, isAdmin, authLoading 상태가 포함되어 있어야 합니다.
  //    만약 없다면 AuthContext를 수정하여 이 값들을 제공해야 합니다.
  const { user, isAdmin, authLoading } = useAuth();

  // 2. 인증 상태를 확인하는 동안에는 로딩 화면을 표시합니다.
  //    (갑자기 로그인 페이지로 튕기는 현상을 방지합니다)
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>인증 정보를 확인하는 중입니다...</div>
      </div>
    );
  }

  // 3. 로그인하지 않은 사용자인 경우, 로그인 페이지로 보냅니다.
  if (!user) {
    // 사용자가 원래 가려던 경로를 state에 담아서 보냅니다.
    // 이렇게 하면 로그인 성공 후 원래 가려던 페이지로 이동시킬 수 있습니다.
    return <Navigate to="/login" replace />;
  }

  // 4. 관리자 전용 페이지인데 관리자가 아닌 경우, 홈페이지로 보냅니다.
  if (adminOnly && !isAdmin) {
    // 접근 권한이 없으므로 홈페이지로 리디렉션합니다.
    return <Navigate to="/" replace />;
  }

  // 5. 모든 검사를 통과한 경우, 요청한 페이지(자식 라우트)를 보여줍니다.
  return <Outlet />;
};

export default ProtectedRoute;
