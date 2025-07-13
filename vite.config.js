import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // .env.local 파일이 동작하지 않는 문제를 해결하기 위해,
  // 개발 모드일 때 사용할 환경 변수 값을 여기에 직접 설정합니다.
  const developmentEnv = {
    VITE_API_URL: 'http://localhost:3001',
    // 중요: 아래 'YOUR_NAVER_CLIENT_ID' 부분에 원장님의 네이버 클라이언트 ID를 직접 붙여넣어 주세요.
    VITE_NAVER_MAP_CLIENT_ID: 'h8g0go71la',
  };

  return {
    plugins: [react()],
    // 'define' 옵션을 사용해 코드 내의 특정 변수를 강제로 치환합니다.
    define: {
      // 개발 모드일 때는 위에서 직접 설정한 값을 사용하고,
      // Vercel에서 빌드할 때(production 모드)는 Vercel 대시보드에 설정된 환경 변수를 사용합니다.
      'import.meta.env.VITE_API_URL': JSON.stringify(
        mode === 'development' ? developmentEnv.VITE_API_URL : process.env.VITE_API_URL
      ),
      'import.meta.env.VITE_NAVER_MAP_CLIENT_ID': JSON.stringify(
        mode === 'development' ? developmentEnv.VITE_NAVER_MAP_CLIENT_ID : process.env.VITE_NAVER_MAP_CLIENT_ID
      )
    }
  }
})
