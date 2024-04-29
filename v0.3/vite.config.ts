import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [dts({
    rollupTypes: true,
  }), vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/lunchboxjs/index.ts'),
      name: 'LunchboxJS',
      formats: ['cjs', 'umd', 'es'],
      fileName: "lunchboxjs"
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
