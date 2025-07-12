import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      // 네이버 지도 클라이언트 ID 이름을 밑줄(_)로 수정합니다.
      'import.meta.env.VITE_NAVER_MAP_CLIENT_ID': JSON.stringify(env.VITE_NAVER_MAP_CLIENT_ID)
    }
  }
})
