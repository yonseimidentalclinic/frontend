import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 'mode'는 현재 실행 상태를 알려줍니다. (yarn dev 실행 시 'development')
  
  return {
    plugins: [react()],
    // 'define' 옵션을 사용해 코드 내의 특정 변수를 강제로 치환합니다.
    define: {
      // 코드에서 import.meta.env.VITE_API_URL을 만나면,
      // 현재 모드가 'development'일 경우 'http://localhost:3001'로 강제 치환합니다.
      // Vercel에서 빌드할 때는 Vercel의 환경 변수를 사용하게 됩니다.
      'import.meta.env.VITE_API_URL': JSON.stringify(
        mode === 'development'
          ? 'http://localhost:3001'
          : process.env.VITE_API_URL
      ),
    },
  };
});
