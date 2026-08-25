import { defineConfig } from 'vite';
import { resolve } from 'path';

/**
 * Builds the self-contained bundles — `cjs`, `umd`, and a single-file `es` — at
 * the same paths they have always had. Lit stays inlined in these: CJS/UMD
 * cannot resolve it any other way (Lit is ESM-only), and the `es` bundle is what
 * the importmap/CDN path in docs/install.md loads, where there is no bundler and
 * no Lit of the consumer's own.
 *
 * The package's `import` entry is NOT built here — `tsc -p tsconfig.build.json`
 * emits it as unbundled modules that import `lit` by bare specifier, so a
 * bundler consumer resolves Lit once, to the same copy and the same
 * development/production build as the rest of their app. Inlining Lit there is
 * what breaks: two Lit instances, and because the `development` export condition
 * selects builds with different internal method names, a custom directive
 * authored against the app's Lit fails inside a Lunchbox component with
 * `_$AT is not a function`.
 */
export default defineConfig({
    build: {
        // Don't wipe dist — tsc writes the `import` entry here too, and the
        // build script runs tsc first.
        emptyOutDir: false,
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
