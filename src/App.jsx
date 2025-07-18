// src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 공용 레이아웃 컴포넌트
import MainLayout from './components/MainLayout';
import AdminLayout from './components/AdminLayout';

// --- 환자용 페이지 컴포넌트 (실제로 존재하는 파일만 import) ---
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
import ReservationPage from './pages/ReservationPage';
// *** 수정: ReviewPage.jsx 파일이 없어 빌드 오류가 발생하므로 관련 코드를 주석 처리합니다. ***
// import ReviewPage from './pages/ReviewPage';

// --- 관리자용 페이지 컴포넌트 (스크린샷에서 확인된 파일만 활성화) ---
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminNoticeListPage from './pages/admin/AdminNoticeListPage';
import AdminConsultationListPage from './pages/admin/AdminConsultationListPage';
// *** 수정: 스크린샷의 실제 파일 이름(AdminCasePhotosPage)에 맞게 수정했습니다. ***
import AdminCasePhotosPage from './pages/admin/AdminCasePhotosPage'; 
// *** 수정: 스크린샷의 실제 파일 이름(AdminDoctorListPage)에 맞게 수정했습니다. ***
import AdminDoctorListPage from './pages/admin/AdminDoctorListPage';
import AdminAboutPage from './pages/admin/AdminAboutPage';

// --- 참고 ---
// 아래 관리자 페이지 파일들은 아직 프로젝트에 없어 빌드 오류를 유발할 수 있습니다.
// 향후 해당 페이지 파일을 생성하신 후, 이 import와 아래 Routes의 경로 주석을 해제하여 사용해주세요.
// import AdminPostListPage from './pages/admin/AdminPostListPage';
// import AdminFaqListPage from './pages/admin/AdminFaqListPage';
// import AdminReviewListPage from './pages/admin/AdminReviewListPage';
// import AdminReservationListPage from './pages/admin/AdminReservationListPage';
// import AdminSchedulePage from './pages/admin/AdminSchedulePage';


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
          {/* *** 수정: ReviewPage 라우트를 주석 처리합니다. *** */}
          {/* <Route path="reviews" element={<ReviewPage />} /> */}
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
          <Route path="doctors" element={<AdminDoctorListPage />} />
          <Route path="cases" element={<AdminCasePhotosPage />} />
          <Route path="notices" element={<AdminNoticeListPage />} />
          <Route path="consultations" element={<AdminConsultationListPage />} />
          
          {/* --- 참고 --- */}
          {/* 아래 페이지들은 파일을 만드신 후 주석을 해제하여 경로를 연결해주세요. */}
          {/* <Route path="reservations" element={<AdminReservationListPage />} /> */}
          {/* <Route path="schedule" element={<AdminSchedulePage />} /> */}
          {/* <Route path="reviews" element={<AdminReviewListPage />} /> */}
          {/* <Route path="faqs" element={<AdminFaqListPage />} /> */}
          {/* <Route path="posts" element={<AdminPostListPage />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
