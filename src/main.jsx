import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NavermapsProvider } from 'react-naver-maps';

import App from './App.jsx';
import './index.css';

// 로딩 스피너 컴포넌트 import
import LoadingSpinner from './components/LoadingSpinner.jsx';

// 레이아웃 및 보안 컴포넌트 (이미 lazy loading 되어 있을 필요는 없습니다)
import AdminLayout from './components/AdminLayout.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// 사용자 페이지 (Lazy Loading)
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
const PostListPage = lazy(() => import('./pages/PostListPage.jsx'));
const PostDetailPage = lazy(() => import('./pages/PostDetailPage.jsx'));
const PostWritePage = lazy(() => import('./pages/PostWritePage.jsx'));

// 관리자 페이지 (Lazy Loading)
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage.jsx'));
const AdminConsultationListPage = lazy(() => import('./pages/admin/AdminConsultationListPage.jsx'));
const AdminConsultationDetailPage = lazy(() => import('./pages/admin/AdminConsultationDetailPage.jsx'));
const AdminNoticeListPage = lazy(() => import('./pages/admin/AdminNoticeListPage.jsx'));
const AdminNoticeWritePage = lazy(() => import('./pages/admin/AdminNoticeWritePage.jsx'));
const AdminNoticeEditPage = lazy(() => import('./pages/admin/AdminNoticeEditPage.jsx'));
const AdminPostListPage = lazy(() => import('./pages/admin/AdminPostListPage.jsx'));

// Suspense로 각 페이지를 감싸도록 라우터 설정 수정
const createSuspenseElement = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // 사용자 사이트 라우트
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: createSuspenseElement(HomePage) },
      { path: 'about', element: createSuspenseElement(AboutPage) },
      { path: 'services', element: createSuspenseElement(ServicesPage) },
      { path: 'contact', element: createSuspenseElement(ContactPage) },
      { path: 'notices', element: createSuspenseElement(NoticeListPage) },
      { path: 'notices/:id', element: createSuspenseElement(NoticeDetailPage) },
      { path: 'consultations', element: createSuspenseElement(ConsultationListPage) },
      { path: 'consultations/write', element: createSuspenseElement(ConsultationWritePage) },
      { path: 'consultations/:id', element: createSuspenseElement(ConsultationDetailPage) },
      { path: 'posts', element: createSuspenseElement(PostListPage) },
      { path: 'posts/write', element: createSuspenseElement(PostWritePage) },
      { path: 'posts/:id', element: createSuspenseElement(PostDetailPage) },
      { path: 'location', element: createSuspenseElement(LocationPage) },
    ],
  },
  // 관리자 사이트 라우트
  {
    path: '/admin',
    children: [
      { path: 'login', element: createSuspenseElement(AdminLoginPage) },
      {
        element: <PrivateRoute />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: createSuspenseElement(AdminDashboardPage) },
              { path: 'consultations', element: createSuspenseElement(AdminConsultationListPage) },
              { path: 'consultations/:id', element: createSuspenseElement(AdminConsultationDetailPage) },
              { path: 'notices', element: createSuspenseElement(AdminNoticeListPage) },
              { path: 'notices/new', element: createSuspenseElement(AdminNoticeWritePage) },
              { path: 'notices/edit/:id', element: createSuspenseElement(AdminNoticeEditPage) },
              { path: 'posts', element: createSuspenseElement(AdminPostListPage) },
            ],
          },
        ],
      },
    ],
  },
]);

const NAVER_MAP_CLIENT_ID = import.meta.env.VITE_NAVER_MAP_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NavermapsProvider ncpClientId={NAVER_MAP_CLIENT_ID}>
      <HelmetProvider>
        {/* RouterProvider는 Suspense 밖으로 이동 */}
        <RouterProvider router={router} />
      </HelmetProvider>
    </NavermapsProvider>
  </React.StrictMode>
);
