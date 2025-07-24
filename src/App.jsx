// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// 공용 레이아웃 컴포넌트
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// --- 환자용 페이지 컴포넌트 ---
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import CasesPage from './pages/CasesPage';
import FaqPage from './pages/FaqPage';
import LocationPage from './pages/LocationPage';
import NoticeListPage from './pages/NoticeListPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import PostEditPage from './pages/PostEditPage';
import ConsultationListPage from './pages/ConsultationListPage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import ConsultationWritePage from './pages/ConsultationWritePage';
import ConsultationEditPage from './pages/ConsultationEditPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewWritePage from './pages/ReviewWritePage';
import ReservationPage from './pages/ReservationPage';
import ReservationCheckPage from './pages/ReservationCheckPage';
import ReservationDetailPage from './pages/ReservationDetailPage';
import ReservationEditPage from './pages/ReservationEditPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';

// --- 관리자용 페이지 컴포넌트 ---
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminDoctorsListPage from './pages/admin/AdminDoctorsListPage';
import AdminCasePhotosPage from './pages/admin/AdminCasePhotosPage';
import AdminNoticeListPage from './pages/admin/AdminNoticeListPage';
import AdminNoticeWritePage from './pages/admin/AdminNoticeWritePage';
import AdminNoticeEditPage from './pages/admin/AdminNoticeEditPage';
import AdminPostListPage from './pages/admin/AdminPostListPage';
import AdminPostEditPage from './pages/admin/AdminPostEditPage';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage';
import AdminConsultationReplyPage from './pages/admin/AdminConsultationReplyPage';
import AdminConsultationEditPage from './pages/admin/AdminConsultationEditPage';
import AdminReservationListPage from './pages/admin/AdminReservationListPage';
import AdminReviewListPage from './pages/admin/AdminReviewListPage';
import AdminFaqListPage from './pages/admin/AdminFaqListPage';
import AdminSchedulePage from './pages/admin/AdminSchedulePage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';


// 인증 상태에 따라 페이지 접근을 제어하는 컴포넌트
const ProtectedRoute = ({ children, forAdmin = false }) => {
  const { user, loading } = useAuth(); // 환자 로그인 상태
  const isAdminAuthenticated = !!localStorage.getItem('accessToken'); // 관리자 로그인 상태

  if (loading && forAdmin === false) {
    return <div>로딩중...</div>;
  }

  if (forAdmin) {
    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
  } else {
    return user ? children : <Navigate to="/login" />;
  }
};

// App 컴포넌트를 분리하여 AuthProvider 내부에서 useAuth를 사용할 수 있도록 함
function AppContent() {
  return (
    <Routes>
      {/* 환자용 페이지 라우트 */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="doctors" element={<DoctorsPage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="faq" element={<FaqPage />} />
        <Route path="location" element={<LocationPage />} />
        <Route path="notices" element={<NoticeListPage />} />
        <Route path="notices/:id" element={<NoticeDetailPage />} />
        <Route path="posts" element={<PostListPage />} />
        <Route path="posts/:id" element={<PostDetailPage />} />
        <Route path="posts/write" element={<PostWritePage />} />
        <Route path="posts/edit/:id" element={<PostEditPage />} />
        <Route path="consultations" element={<ConsultationListPage />} />
        <Route path="consultations/:id" element={<ConsultationDetailPage />} />
        <Route path="consultations/write" element={<ConsultationWritePage />} />
        <Route path="consultations/edit/:id" element={<ConsultationEditPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="reviews/write" element={<ReviewWritePage />} />
        <Route path="reservation" element={<ReservationPage />} />
        <Route path="reservation/check" element={<ReservationCheckPage />} />
        <Route path="reservation/:id" element={<ReservationDetailPage />} />
        <Route path="reservation/edit/:id" element={<ReservationEditPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="mypage" element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        } />
      </Route>

      {/* 관리자 페이지 라우트 */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute forAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="logs" element={<AdminLogsPage />} />
        <Route path="users" element={<AdminUserListPage />} />
        <Route path="about" element={<AdminAboutPage />} />
        <Route path="doctors" element={<AdminDoctorsListPage />} />
        <Route path="cases" element={<AdminCasePhotosPage />} />
        <Route path="reservations" element={<AdminReservationListPage />} />
        <Route path="reviews" element={<AdminReviewListPage />} />
        <Route path="faqs" element={<AdminFaqListPage />} />
        <Route path="schedule" element={<AdminSchedulePage />} />
        <Route path="notices" element={<AdminNoticeListPage />} />
        <Route path="notices/new" element={<AdminNoticeWritePage />} />
        <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
        <Route path="posts" element={<AdminPostListPage />} />
        <Route path="posts/edit/:id" element={<AdminPostEditPage />} />
        <Route path="consultations" element={<AdminConsultationListPage />} />
        <Route path="consultations/reply/:id" element={<AdminConsultationReplyPage />} />
        <Route path="consultations/edit/:id" element={<AdminConsultationEditPage />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
