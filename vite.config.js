import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss(),],
  test: {
    globals: true, // This ensures `describe`, `it`, etc. are globally available
    environment: 'jsdom', // Needed for testing Vue components
  },
})
