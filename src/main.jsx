// =================================================================
// 프론트엔드 시작 파일 (main.jsx)
// 파일 경로: /src/main.jsx
// 주요 기능:
// 1. React 앱의 공식적인 시작점
// 2. App 컴포넌트를 불러와 index.html에 렌더링
// 3. 전체 앱에 적용될 CSS 파일 임포트
// =================================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // Tailwind CSS를 포함한 기본 스타일시트

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
