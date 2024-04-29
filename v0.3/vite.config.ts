import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lunchboxjs/index.ts'),
      name: 'LunchboxJS',
      fileName: "lunchbox-js"
    },
    rollupOptions: {
      external: [
        'vue',
        'three'
      ],
      output: {
        globals: {
          vue: 'vue',
          THREE: 'THREE',
          three: 'three',
          lodash: 'lodash',
        }
      }
    }
  }
})
