import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Experiments/wortspiel/',
  build: {
    outDir: '../../static/Experiments/wortspiel',
    emptyOutDir: true,
  },
})
