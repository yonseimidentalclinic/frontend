import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 .env 파일을 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // 'define' 옵션을 사용해 코드 내의 특정 변수를 강제로 치환합니다.
    define: {
      // 코드에서 import.meta.env.VITE_API_URL을 만나면,
      // .env.local 파일에서 읽어온 VITE_API_URL 값(문자열)으로 바꿔치기합니다.
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL)
    }
  }
})
