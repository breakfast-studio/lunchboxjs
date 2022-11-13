/// <reference types="histoire" />

import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue'
import { resolve } from 'pathe'

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
      alias: {
        '/@': resolve(__dirname, './src'),
      },
    },
    plugins: [
        vue({}),
    ]
})