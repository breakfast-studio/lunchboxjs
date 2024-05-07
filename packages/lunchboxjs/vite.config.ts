import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'LunchboxJS',
            formats: ['cjs', 'umd', 'es'],
            fileName: "lunchboxjs"
        },
        rollupOptions: {
            external: [
                'three'
            ],
            output: {
                globals: {
                    THREE: 'THREE',
                    three: 'three',
                }
            }
        }
    }
})
