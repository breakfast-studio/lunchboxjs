import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [dts({
    })],
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
        },
    },
    test: {
        environment: 'happy-dom'
    }
});
