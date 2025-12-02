import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리에서 환경 변수 로드
  const env = loadEnv(mode, process.cwd(), '');

  console.log('🔒 [Build Debug] Mode:', mode);
  console.log('🔒 [Build Debug] VITE_GEMINI_API_KEY from env:', env.VITE_GEMINI_API_KEY ? 'Present (Length: ' + env.VITE_GEMINI_API_KEY.length + ')' : 'Missing');
  console.log('🔒 [Build Debug] VITE_GEMINI_API_KEY from process.env:', process.env.VITE_GEMINI_API_KEY ? 'Present (Length: ' + process.env.VITE_GEMINI_API_KEY.length + ')' : 'Missing');

  return {
    plugins: [react()],
    base: './',
    define: {
      // 시스템 환경 변수(GitHub Actions) 또는 .env 파일의 값을 코드에 주입
      'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(process.env.VITE_GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
    },
  };
})
