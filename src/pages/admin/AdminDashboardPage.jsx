import React from 'react';
import { Helmet } from 'react-helmet-async';

function AdminDashboardPage() {
  return (
    <>
      <Helmet>
        <title>관리자 대시보드 | 연세미치과</title>
      </Helmet>
      <div>
        <h1 className="text-2xl font-bold">관리자 대시보드</h1>
        <p className="mt-4">이곳에서 예약 현황, 온라인 상담 등을 관리할 수 있습니다.</p>
      </div>
    </>
  );
}

export default AdminDashboardPage;
