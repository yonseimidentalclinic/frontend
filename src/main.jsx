import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

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
    ],
  },
  // 관리자 사이트 라우트
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      // /admin 경로의 모든 하위 경로는 PrivateRoute의 검사를 거칩니다.
      {
        element: <PrivateRoute />,
        children: [
          // PrivateRoute를 통과한 경우에만 AdminLayout을 보여줍니다.
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
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={loadingMarkup}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);
