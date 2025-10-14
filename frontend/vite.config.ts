import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export const API_URL = process.env.VITE_API_URL || 'http://localhost:8080/pixelate'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
})

