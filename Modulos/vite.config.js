import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    proxy: {
      '/users': 'http://10.5.225.37:3001',
      '/tareas': 'http://10.5.225.37:3001'
    }
  }
})
