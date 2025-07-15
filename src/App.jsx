// =================================================================
// 프론트엔드 최종 라우팅 설정 (App.jsx)
// 최종 업데이트: 2025년 7월 15일
// 주요 개선사항:
// 1. AdminLoginPage.jsx의 경로를 실제 파일 위치에 맞게 최종 수정
// 2. 모든 컴포넌트의 import 경로를 다시 한번 점검 및 확정
// =================================================================

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet, Link } from 'react-router-dom';

// 공용 컴포넌트
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import AdminSidebar from './components/AdminSidebar.jsx';

// 사용자 페이지 컴포넌트 임포트
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import NoticeListPage from './pages/NoticeListPage.jsx';
import NoticeDetailPage from './pages/NoticeDetailPage.jsx';
import ConsultationListPage from './pages/ConsultationListPage.jsx';
import ConsultationWritePage from './pages/ConsultationWritePage.jsx';
import ConsultationDetailPage from './pages/ConsultationDetailPage.jsx';
import ConsultationVerifyPage from './pages/ConsultationVerifyPage.jsx';
import PostListPage from './pages/PostListPage.jsx';
import PostWritePage from './pages/PostWritePage.jsx';
import PostDetailPage from './pages/PostDetailPage.jsx';
import LocationPage from './pages/LocationPage.jsx';

// 관리자 페이지 컴포넌트 임포트
// [핵심 수정] AdminLoginPage의 경로를 원장님께서 알려주신 'src/pages/'로 바로잡았습니다.
import AdminLoginPage from './pages/AdminLoginPage.jsx'; 
import AdminDashboardPage from './pages/admin/AdminDashboardPage.jsx';
import AdminNoticeListPage from './pages/admin/AdminNoticeListPage.jsx';
import AdminNoticeWritePage from './pages/admin/AdminNoticeWritePage.jsx';
import AdminNoticeEditPage from './pages/admin/AdminNoticeEditPage.jsx';
import AdminPostListPage from './pages/admin/AdminPostListPage.jsx';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage.jsx';
import AdminConsultationReplyPage from './pages/admin/AdminConsultationReplyPage.jsx';

// --- 레이아웃 컴포넌트 ---

const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AdminLayout = () => (
  <div className="flex h-screen bg-gray-100">
    <AdminSidebar />
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <Outlet />
      </main>
    </div>
  </div>
);

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
          <Route path="/" element={<HomePage />} />
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
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="notices" element={<AdminNoticeListPage />} />
          <Route path="notices/write" element={<AdminNoticeWritePage />} />
          <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
          <Route path="posts" element={<AdminPostListPage />} />
          <Route path="consultations" element={<AdminConsultationListPage />} />
          <Route path="consultations/reply/:id" element={<AdminConsultationReplyPage />} />
        </Route>

        {/* 404 Not Found 페이지 */}
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
