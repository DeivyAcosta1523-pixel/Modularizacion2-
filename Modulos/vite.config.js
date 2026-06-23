import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/users': 'http:// 172.25.208.1:3001',
      '/tareas': 'http:// 172.25.208.1:3001'
    }
  }
})
