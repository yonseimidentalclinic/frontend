import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NavermapsProvider } from 'react-naver-maps'; // 1. 네이버 지도 Provider를 불러옵니다.

import App from './App.jsx';
import './index.css';

// 레이아웃 및 보안 컴포넌트
import AdminLayout from './components/AdminLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// 사용자 페이지
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NoticeListPage = lazy(() => import('./pages/NoticeListPage.jsx'));
const NoticeDetailPage = lazy(() => import('./pages/NoticeDetailPage.jsx'));
const ConsultationListPage = lazy(() => import('./pages/ConsultationListPage.jsx'));
const ConsultationWritePage = lazy(() => import('./pages/ConsultationWritePage.jsx'));
const ConsultationDetailPage = lazy(() => import('./pages/ConsultationDetailPage.jsx'));
const LocationPage = lazy(() => import('./pages/LocationPage.jsx'));

// 관리자 페이지
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminConsultationListPage = lazy(() => import('./pages/admin/AdminConsultationListPage.jsx'));
const AdminConsultationDetailPage = lazy(() => import('./pages/admin/AdminConsultationDetailPage.jsx'));
const AdminNoticeListPage = lazy(() => import('./pages/admin/AdminNoticeListPage.jsx'));
const AdminNoticeWritePage = lazy(() => import('./pages/admin/AdminNoticeWritePage.jsx'));
const AdminNoticeEditPage = lazy(() => import('./pages/admin/AdminNoticeEditPage.jsx'));


const router = createBrowserRouter([
  // 사용자 사이트 라우트
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'notices', element: <NoticeListPage /> },
      { path: 'notices/:id', element: <NoticeDetailPage /> },
      { path: 'consultations', element: <ConsultationListPage /> },
      { path: 'consultations/write', element: <ConsultationWritePage /> },
      { path: 'consultations/:id', element: <ConsultationDetailPage /> },
      { path: 'location', element: <LocationPage /> },
    ],
  },
  // 관리자 사이트 라우트
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
              { path: 'consultations', element: <AdminConsultationListPage /> },
              { path: 'consultations/:id', element: <AdminConsultationDetailPage /> },
              { path: 'notices', element: <AdminNoticeListPage /> },
              { path: 'notices/new', element: <AdminNoticeWritePage /> },
              { path: 'notices/edit/:id', element: <AdminNoticeEditPage /> },
            ],
          },
        ],
      },
    ],
  },
]);

const loadingMarkup = (
  <div className="flex justify-center items-center h-screen">
    <p className="text-lg">페이지를 불러오는 중입니다...</p>
  </div>
);

// 2. 환경 변수에서 네이버 클라이언트 ID를 가져옵니다.
const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 3. NavermapsProvider로 전체 앱을 감싸고, Client ID를 전달합니다. */}
    <NavermapsProvider ncpClientId={NAVER_MAP_CLIENT_ID}>
      <HelmetProvider>
        <Suspense fallback={loadingMarkup}>
          <RouterProvider router={router} />
        </Suspense>
      </HelmetProvider>
    </NavermapsProvider>
  </React.StrictMode>
);
