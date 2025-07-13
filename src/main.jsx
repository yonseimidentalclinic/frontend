// 파일 경로: src/main.jsx

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NavermapsProvider } from 'react-naver-maps';

import App from '/src/App.jsx';
import '/src/index.css';

import LoadingSpinner from '/src/components/LoadingSpinner.jsx';
import AdminLayout from '/src/components/AdminLayout.jsx';
import PrivateRoute from '/src/components/PrivateRoute.jsx';

// 모든 페이지 컴포넌트를 Lazy Loading 합니다.
const HomePage = lazy(() => import('/src/pages/HomePage.jsx'));
const AboutPage = lazy(() => import('/src/pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('/src/pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('/src/pages/ContactPage.jsx'));
const NoticeListPage = lazy(() => import('/src/pages/NoticeListPage.jsx'));
const NoticeDetailPage = lazy(() => import('/src/pages/NoticeDetailPage.jsx'));
const ConsultationListPage = lazy(() => import('/src/pages/ConsultationListPage.jsx'));
const ConsultationWritePage = lazy(() => import('/src/pages/ConsultationWritePage.jsx'));
const ConsultationDetailPage = lazy(() => import('/src/pages/ConsultationDetailPage.jsx'));
const LocationPage = lazy(() => import('/src/pages/LocationPage.jsx'));
const PostListPage = lazy(() => import('/src/pages/PostListPage.jsx'));
const PostDetailPage = lazy(() => import('/src/pages/PostDetailPage.jsx'));
const PostWritePage = lazy(() => import('/src/pages/PostWritePage.jsx'));

const AdminLoginPage = lazy(() => import('/src/pages/AdminLoginPage.jsx'));
const AdminDashboardPage = lazy(() => import('/src/pages/admin/AdminDashboardPage.jsx'));
const AdminConsultationListPage = lazy(() => import('/src/pages/admin/AdminConsultationListPage.jsx'));
const AdminConsultationDetailPage = lazy(() => import('/src/pages/admin/AdminConsultationDetailPage.jsx'));
const AdminNoticeListPage = lazy(() => import('/src/pages/admin/AdminNoticeListPage.jsx'));
const AdminNoticeWritePage = lazy(() => import('/src/pages/admin/AdminNoticeWritePage.jsx'));
const AdminNoticeEditPage = lazy(() => import('/src/pages/admin/AdminNoticeEditPage.jsx'));
const AdminPostListPage = lazy(() => import('/src/pages/admin/AdminPostListPage.jsx'));

const createSuspenseElement = (Component) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
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
  <NavermapsProvider ncpClientId={NAVER_MAP_CLIENT_ID}>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </NavermapsProvider>
);
