import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import HomePage from './pages/HomePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import './index.css';

// 라우터 설정: 어떤 주소(path)에 어떤 컴포넌트(element)를 보여줄지 정의
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> }, // 기본 페이지
      { path: 'about', element: <AboutPage /> }, // /about 주소
      { path: 'services', element: <ServicesPage /> }, // /services 주소
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);