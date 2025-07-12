import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './index.css';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));
const NoticeListPage = lazy(() => import('./pages/NoticeListPage.jsx'));
const NoticeDetailPage = lazy(() => import('./pages/NoticeDetailPage.jsx'));
const ConsultationListPage = lazy(() => import('./pages/ConsultationListPage.jsx'));
const ConsultationWritePage = lazy(() => import('./pages/ConsultationWritePage.jsx'));
const ConsultationDetailPage = lazy(() => import('./pages/ConsultationDetailPage.jsx'));

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
      { path: 'consultations', element: <ConsultationListPage /> },
      { path: 'consultations/write', element: <ConsultationWritePage /> },
      { path: 'consultations/:id', element: <ConsultationDetailPage /> },
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
