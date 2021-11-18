import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue(), glsl()],
    build: {
        rollupOptions: {
            input: {
                main: 'index.html',

                customScene: 'demo/custom-scene/index.html',
                customShader: 'demo/custom-shader/index.html',
                events: 'demo/events/index.html',
                hierarchy: 'demo/hierarchy/index.html',
                loader: 'demo/loader/index.html',
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
})
