import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '4173'),
    strictPort: true,
    allowedHosts: [
      'cyberlootapplication-patitasvelocesteam.onrender.com',
      '.onrender.com', // Permite todos los subdominios de Render
      'localhost',
    ],
  },
  server: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5173'),
    strictPort: true,
  },
})
