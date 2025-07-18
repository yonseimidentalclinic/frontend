// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 공용 레이아웃 컴포넌트
// components 폴더 바로 아래에 있는 MainLayout과 AdminLayout을 불러옵니다.
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// 환자용 페이지 컴포넌트
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import DoctorsPage from './pages/DoctorsPage';
import CasesPage from './pages/CasesPage';
import FaqPage from './pages/FaqPage'; 
import InfoPage from './pages/InfoPage';
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
import ReviewPage from './pages/ReviewPage';
import ReservationPage from './pages/ReservationPage';

// 관리자용 페이지 컴포넌트 (모든 페이지 import)
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminNoticeListPage from './pages/admin/AdminNoticeListPage';
import AdminPostListPage from './pages/admin/AdminPostListPage';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage';
import AdminFaqListPage from './pages/admin/AdminFaqListPage';
import AdminReviewListPage from './pages/admin/AdminReviewListPage';
import AdminReservationListPage from './pages/admin/AdminReservationListPage';
import AdminCasesListPage from './pages/admin/AdminCasesListPage';
import AdminDoctorsListPage from './pages/admin/AdminDoctorsListPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminSchedulePage from './pages/admin/AdminSchedulePage';


// 인증 상태에 따라 관리자 페이지 접근을 제어하는 컴포넌트
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('accessToken');
  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* 환자용 페이지 라우트 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="doctors" element={<DoctorsPage />} />
          <Route path="cases" element={<CasesPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="info" element={<InfoPage />} />
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
          <Route path="reviews" element={<ReviewPage />} />
          <Route path="reservation" element={<ReservationPage />} />
        </Route>

        {/* 관리자용 페이지 라우트 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="reservations" element={<AdminReservationListPage />} />
          <Route path="schedule" element={<AdminSchedulePage />} />
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="doctors" element={<AdminDoctorsListPage />} />
          <Route path="cases" element={<AdminCasesListPage />} />
          <Route path="reviews" element={<AdminReviewListPage />} />
          <Route path="faqs" element={<AdminFaqListPage />} />
          <Route path="notices" element={<AdminNoticeListPage />} />
          <Route path="posts" element={<AdminPostListPage />} />
          <Route path="consultations" element={<AdminConsultationListPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
