import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 1. 현재 모드(development 또는 production)에 맞는 .env 파일을 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // 2. 'define' 옵션을 사용해 코드 내의 특정 변수를 강제로 치환합니다.
    define: {
      // .env 파일에서 읽어온 모든 VITE_ 변수들을 코드에서 사용할 수 있도록 설정합니다.
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      // 쉼표를 정확히 추가하고, 네이버 지도 키만 남깁니다.
      'import.meta.env.VITE_NAVER_MAP_CLIENT_ID': JSON.stringify(env.VITE_NAVER_MAP_CLIENT_ID)
    }
  }
})
