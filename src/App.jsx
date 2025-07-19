// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 공용 레이아웃 컴포넌트
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// --- 환자용 페이지 컴포넌트 (실제로 존재하는 파일만 import) ---
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import AdminLoginPage from './pages/AdminLoginPage';
import CasesPage from './pages/CasesPage';
import ConsultationDetailPage from './pages/ConsultationDetailPage';
import ConsultationEditPage from './pages/ConsultationEditPage';
import ConsultationListPage from './pages/ConsultationListPage';
import ConsultationWritePage from './pages/ConsultationWritePage';
import ConsultationVerifyPage from './pages/ConsultationVerifyPage';
import ContactPage from './pages/ContactPage';
import DoctorsPage from './pages/DoctorsPage';
import FaqPage from './pages/FaqPage';
import LocationPage from './pages/LocationPage';
import NoticeDetailPage from './pages/NoticeDetailPage';
import NoticeListPage from './pages/NoticeListPage';
import PostVerifyPage from './pages/PostVerifyPage';
import PostListPage from './pages/PostListPage';
import PostDetailPage from './pages/PostDetailPage';
import PostWritePage from './pages/PostWritePage';
import PostEditPage from './pages/PostEditPage';
import ReservationPage from './pages/ReservationPage';
// *** 수정: ReviewPage.jsx 파일이 없어 빌드 오류가 발생하므로 관련 코드를 주석 처리합니다. ***
import ReviewsPage from './pages/ReviewsPage';
import ReviewWritePage from './pages/ReviewWritePage';
import ServicesPage from './pages/ServicesPage';
// -관리자용 페이지 컴포넌트 (스크린샷에서 확인된 파일만 활성화) ---

import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminCasePhotosPage from './pages/admin/AdminCasePhotosPage';
import AdminClinicPhotospage from './pages/admin/AdminClinicPhotosPage';
import AdminConsultationDetailPage from './pages/admin/AdminConsultationDetailPage';
import AdminConsultationEditPage from './pages/admin/AdminConsultationEditPage';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage';
import AdminConsultationReplyPage from './pages/admin/AdminConsultationReplyPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminDoctorsListPage from './pages/admin/AdminDoctorsListPage';
import AdminFaqListPage from './pages/admin/AdminFaqListPage';
import AdminFaqPage from './pages/admin/AdminFaqPage';
import AdminLogsPage from './pages/admin/AdminLogsPage';
import AdminNoticeEditPage from './pages/admin/AdminNoticeEditPage';
import AdminNoticeListPage from './pages/admin/AdminNoticeListPage';
import AdminNoticeWritePage from './pages/admin/AdminNoticeWritePage';
import AdminPostEditPage from './pages/admin/AdminPostEditPage';
import AdminPostListPage from './pages/admin/AdminPostListPage';
import AdminReservationListPage from './pages/admin/AdminReservationListPage';
import AdminReservationsPage from './pages/admin/AdminReservationsPage';
import AdminReviewListPage from './pages/admin/AdminReviewListPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
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
          <Route path="location" element={<LocationPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="reviews/write" element={<ReviewWritePage />} />
          <Route path="consultations/verify" element={<ConsultationVerifyPage />} />
          <Route path="posts/verify" element={<PostVerifyPage />} />


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
          <Route path="reservation" element={<ReservationPage />} />
          <Route path="review/write" element={<ReviewWritePage />} />


          {/* *** 수정: ReviewPage 라우트를 주석 처리합니다. *** */}
          <Route path="reviews" element={<ReviewsPage />} /> 
        </Route>

        {/* 관리자용 페이지 라우트 (실제로 존재하는 페이지만 연결) */}
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
          <Route path="about" element={<AdminAboutPage />} />
          <Route path="doctors" element={<AdminDoctorsListPage />} />
          <Route path="cases" element={<AdminCasePhotosPage />} />
          <Route path="notices" element={<AdminNoticeListPage />} />
          <Route path="consultations" element={<AdminConsultationListPage />} />
          <Route path="consultations/:id" element={<AdminConsultationDetailPage />} />
          <Route path="consultations/edit/:id" element={<AdminConsultationEditPage />} />
          <Route path="consultations/reply/:id" element={<AdminConsultationReplyPage />} />
          <Route path="Dashboard" element={<AdminDashboardPage />} />
          <Route path="clinic-photos" element={<AdminClinicPhotospage />} />
          <Route path="Doctors" element={<AdminDoctorsListPage />} />
          <Route path="Faq" element={<AdminFaqPage />} />
          <Route path="faqs" element={<AdminFaqListPage />} />
          <Route path="Logs" element={<AdminLogsPage />} />
          <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
          <Route path="notices/write" element={<AdminNoticeWritePage />} />
          <Route path="Notices" element={<AdminNoticeListPage />} />

          <Route path="posts/edit/:id" element={<AdminPostEditPage />} />
          <Route path="posts" element={<AdminPostListPage />} />
          <Route path="reservations" element={<AdminReservationsPage />} />
          <Route path="reservations/list" element={<AdminReservationListPage />} />
          <Route path="reviews" element={<AdminReviewsPage />} />
          <Route path="reviews/list" element={<AdminReviewListPage />} />
          <Route path="schedule" element={<AdminSchedulePage />} />

          
          {/* --- 참고 --- */}
          {/* 아래 페이지들은 파일을 만드신 후 주석을 해제하여 경로를 연결해주세요. */}
           
           
           
           
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
