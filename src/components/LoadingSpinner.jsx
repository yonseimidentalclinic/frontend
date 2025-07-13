import React from 'react';

const LoadingSpinner = () => {
  return (
    // 페이지 콘텐츠 영역에 표시되도록 높이를 조정 (h-screen 대신 h-96 또는 적절한 값으로)
    <div className="flex justify-center items-center h-96 w-full">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  );
};

export default LoadingSpinner;
