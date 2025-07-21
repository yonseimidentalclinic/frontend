import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. 인증 컨텍스트와 새로운 보호 라우트 컴포넌트를 가져옵니다.
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute'; // ★ 기존 PrivateRoute를 대체할 새 컴포넌트

// --- 공용 레이아웃 컴포넌트 ---
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// --- 환자용 페이지 컴포넌트 (기존 파일 구조 유지) ---
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
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
import ReservationCheckPage from './pages/ReservationCheckPage';
import ReservationDetailPage from './pages/ReservationDetailPage';
import ReservationEditPage from './pages/ReservationEditPage';
import ReviewsPage from './pages/ReviewsPage';
import ReviewWritePage from './pages/ReviewWritePage';
import ServicesPage from './pages/ServicesPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MyPage from './pages/MyPage';

// --- 관리자용 페이지 컴포넌트 (기존 파일 구조 유지) ---
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';
import AdminCasePhotosPage from './pages/admin/AdminCasePhotosPage';
import AdminClinicPhotospage from './pages/admin/AdminClinicPhotosPage';
import AdminConsultationDetailPage from './pages/admin/AdminConsultationDetailPage';
import AdminConsultationEditPage from './pages/admin/AdminConsultationEditPage';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage';
import AdminConsultationReplyPage from './pages/admin/AdminConsultationReplyPage';
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


function App() {
  return (
    // AuthProvider가 앱 전체의 로그인 상태를 관리합니다.
    <AuthProvider>
      <Router>
        <Routes>
          {/* --- 섹션 1: 환자용 페이지 (MainLayout 적용) --- */}
          <Route path="/" element={<MainLayout />}>
            {/* 누구나 접근 가능한 페이지 */}
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
            <Route path="reservation/check" element={<ReservationCheckPage />} />
            <Route path="reservation/:id" element={<ReservationDetailPage />} />
            <Route path="reservation/edit/:id" element={<ReservationEditPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />

            {/* ★★★ 핵심 수정: 로그인한 "일반 사용자"만 접근 가능한 경로 그룹 ★★★ */}
            <Route element={<ProtectedRoute />}>
              <Route path="mypage" element={<MyPage />} />
              {/* 여기에 다른 사용자 전용 페이지(예: 예약내역 상세)를 추가할 수 있습니다. */}
            </Route>
          </Route>

          {/* --- 섹션 2: 관리자용 페이지 --- */}
          {/* 관리자 로그인 페이지는 보호되지 않아야 하므로 외부에 둡니다. */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* ★★★ 핵심 수정: "관리자"만 접근 가능한 경로 그룹 (AdminLayout 적용) ★★★ */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="about" element={<AdminAboutPage />} />
              <Route path="doctors" element={<AdminDoctorsListPage />} />
              <Route path="cases" element={<AdminCasePhotosPage />} />
              <Route path="clinic-photos" element={<AdminClinicPhotospage />} />
              <Route path="faqs" element={<AdminFaqListPage />} />
              <Route path="logs" element={<AdminLogsPage />} />
              <Route path="notices" element={<AdminNoticeListPage />} />
              <Route path="notices/new" element={<AdminNoticeWritePage />} />
              <Route path="notices/edit/:id" element={<AdminNoticeEditPage />} />
              <Route path="posts" element={<AdminPostListPage />} />
              <Route path="posts/edit/:id" element={<AdminPostEditPage />} />
              <Route path="consultations" element={<AdminConsultationListPage />} />
              <Route path="consultations/:id" element={<AdminConsultationDetailPage />} />
              <Route path="consultations/edit/:id" element={<AdminConsultationEditPage />} />
              <Route path="consultations/reply/:id" element={<AdminConsultationReplyPage />} />
              <Route path="reservations" element={<AdminReservationsPage />} />
              <Route path="reviews" element={<AdminReviewsPage />} />
              <Route path="schedule" element={<AdminSchedulePage />} />
              
              {/* 중복되는 경로는 하나로 정리하는 것이 좋습니다. 예: Faq, faqs -> faqs */}
              <Route path="Faq" element={<AdminFaqPage />} />
              <Route path="reservations/list" element={<AdminReservationListPage />} />
              <Route path="reviews/list" element={<AdminReviewListPage />} />
            </Route>
          </Route>
          
          {/* 여기에 404 Not Found 페이지 라우트를 추가할 수 있습니다. */}
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
