// =================================================================
// 프론트엔드 최종 라우팅 설정 (App.jsx)
// 최종 업데이트: 2025년 7월 14일
// 주요 개선사항:
// 1. 모든 사용자 및 관리자 페이지에 대한 라우트(주소)를 완벽하게 설정
// 2. 사용자용 레이아웃과 관리자용 레이아웃을 분리하여 코드 구조 개선
// 3. 관리자 페이지는 로그인을 해야만 접속할 수 있도록 보안 라우팅 적용
// =================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

// 공용 컴포넌트
import Header from './components/Header';
import Footer from './components/Footer';
import AdminSidebar from './components/AdminSidebar';

// 사용자 페이지 컴포넌트 임포트
import MainPage from './pages/MainPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import NoticeListPage from './pages/NoticeListPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import ConsultationListPage from './pages/ConsultationListPage';
import ConsultationWritePage from './pages/ConsultationWritePage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import ConsultationVerifyPage from './pages/ConsultationVerifyPage';
import PostListPage from './pages/PostListPage';
import PostWritePage from './pages/PostWritePage';
import PostDetailPage from './pages/PostDetailPage';
import LocationPage from './pages/LocationPage';

// 관리자 페이지 컴포넌트 임포트
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminNoticesListPage from './pages/admin/AdminNoticesListPage';
import AdminNoticeWritePage from './pages/admin/AdminNoticeWritePage';
import AdminNoticeEditPage from './pages/admin/AdminNoticeEditPage';
import AdminPostsListPage from './pages/admin/AdminPostsListPage';
import AdminConsultationsListPage from './pages/admin/AdminConsultationsListPage';
import AdminConsultationReplyPage from './pages/admin/AdminConsultationReplyPage';

// --- 레이아웃 컴포넌트 ---

// 1. 사용자 페이지용 레이아웃
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet /> {/* 이 부분에 각 페이지 내용이 렌더링됩니다. */}
    </main>
    <Footer />
  </div>
);

// 2. 관리자 페이지용 레이아웃
const AdminLayout = () => (
  <div className="flex h-screen bg-gray-100">
    <AdminSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <Outlet /> {/* 이 부분에 각 관리자 페이지 내용이 렌더링됩니다. */}
      </main>
    </div>
  </div>
);

// 3. 관리자 페이지 보안을 위한 보호막 컴포넌트
const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? <AdminLayout /> : <Navigate to="/admin/login" />;
};


// --- 메인 앱 컴포넌트 ---

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 사용자 페이지 라우트 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/news" element={<NoticeListPage />} />
          <Route path="/news/:id" element={<NoticeDetailPage />} />
          
          <Route path="/consultation" element={<ConsultationListPage />} />
          <Route path="/consultation/write" element={<ConsultationWritePage />} />
          <Route path="/consultation/:id" element={<ConsultationDetailPage />} />
          <Route path="/consultation/:id/verify" element={<ConsultationVerifyPage />} />

          <Route path="/community/posts" element={<PostListPage />} />
          <Route path="/community/posts/write" element={<PostWritePage />} />
          <Route path="/community/posts/:id" element={<PostDetailPage />} />
          
          <Route path="/location" element={<LocationPage />} />
        </Route>

        {/* 관리자 페이지 라우트 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="notices" element={<AdminNoticesListPage />} />
          <Route path="notices/write" element={<AdminNoticeWritePage />} />
          <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
          <Route path="posts" element={<AdminPostsListPage />} />
          <Route path="consultations" element={<AdminConsultationsListPage />} />
          <Route path="consultations/reply/:id" element={<AdminConsultationReplyPage />} />
        </Route>

        {/* 404 Not Found 페이지 (일치하는 주소가 없을 때) */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold">404</h1>
              <p className="text-xl">페이지를 찾을 수 없습니다.</p>
              <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">홈으로 돌아가기</Link>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
