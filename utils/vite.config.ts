import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import demos from '../demo/home/demos.json'
import camelCase from 'lodash/camelCase'
import vueJsx from '@vitejs/plugin-vue-jsx'

// dynamically add demo urls to build
const demoPages = demos.reduce((acc, curr) => {
    acc[curr.title] = `${
        (
            curr.url?.replace(/\/$/, '') || 'demo/' + camelCase(curr.title)
        ).replace(/^\//g, '') + '/index.html'
    }`
    return acc
}, {} as Record<string, string>)

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), glsl(), vueJsx()],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',

                ...demoPages,
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
})
