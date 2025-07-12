import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './index.css';

// 각 페이지 컴포넌트를 동적으로 불러옵니다.
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NoticeListPage = lazy(() => import('./pages/NoticeListPage.jsx'));
const NoticeDetailPage = lazy(() => import('./pages/NoticeDetailPage.jsx'));

// 라우터 설정을 정의합니다.
const router = createBrowserRouter([
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
    ],
  },
]);

// 페이지 로딩 중에 보여줄 화면입니다.
const loadingMarkup = (
  <div className="flex justify-center items-center h-screen">
    <p className="text-lg">페이지를 불러오는 중입니다...</p>
  </div>
)

// React 앱을 렌더링합니다.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <Suspense fallback={loadingMarkup}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);
