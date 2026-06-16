import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/users': 'http://localhost:3001',
      '/tareas': 'http://localhost:3001'
    }
  }
})
