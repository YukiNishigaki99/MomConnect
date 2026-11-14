import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', build: {
    outDir: 'dist', // 出力先を確実に指定
  },
})
