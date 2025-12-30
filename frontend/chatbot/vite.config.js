import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],
  server: {
    allowedHosts: [
      'commodity-quantity-dk-valid.trycloudflare.com', // Your specific tunnel URL
      '.trycloudflare.com', // Allow all trycloudflare.com subdomains for future tunnels
    ],
    // Alternative: uncomment the line below to allow all hosts
    // host: true
  }
})