import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  resolve: {
    alias: {
      '@': 'src',
      '~@': 'src'
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        pure_funcs: ['console.log'],
        drop_debugger: true
      }
    }
  },
  plugins: [vue()]
})
