import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // BASE: cambia esto si publicas en una subcarpeta, ej: '/campus/'
  base: '/',
})
