import { defineConfig } from 'vite'
import jsx from '@vitejs/plugin-vue-jsx'
import { resolve } from 'path'

const PLUGIN_ENTRY_POINTS = [
    resolve(__dirname, 'src/plugins.ts'),
    resolve(__dirname, 'src/orbit/orbit.ts'),
    resolve(__dirname, 'src/gltf/gltf.ts'),

    // Add new plugins here:
    // resolve(__dirname, 'src/YOUR_PLUGIN/YOUR_PLUGIN.ts'),
]

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [jsx()],
    build: {
        lib: {
            entry: PLUGIN_ENTRY_POINTS,
            name: 'LunchboxPlugin',
            fileName: (format, entry) => {
                return `${entry}.${format}.js`
            },
        },
        rollupOptions: {
            external: ['vue', 'three', 'lunchboxjs'],
            output: {
                globals: {
                    vue: 'Vue',
                    three: 'THREE',
                },
            },
        },
    },
})
