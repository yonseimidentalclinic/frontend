import React, { Suspense, lazy } from 'react'; // 1. Suspense와 lazy를 import 합니다.
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import App from './App.jsx';
import './index.css';

// 2. 각 페이지를 lazy를 사용해 동적으로 import 하도록 변경합니다.
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const AboutPage = lazy(() => import('./pages/AboutPage.jsx'));
const ServicesPage = lazy(() => import('./pages/ServicesPage.jsx'));
const ContactPage = lazy(() => import('./pages/ContactPage.jsx'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'services', element: <ServicesPage /> },
      { path: 'contact', element: <ContactPage /> },
    ],
  },
]);

// 로딩 중에 보여줄 간단한 화면
const loadingMarkup = (
  <div className="flex justify-center items-center h-screen">
    <p className="text-lg">페이지를 불러오는 중입니다...</p>
  </div>
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      {/* 3. <Suspense>로 감싸고, 로딩 중에 보여줄 fallback 컨텐츠를 지정합니다. */}
      <Suspense fallback={loadingMarkup}>
        <RouterProvider router={router} />
      </Suspense>
    </HelmetProvider>
  </React.StrictMode>
);
