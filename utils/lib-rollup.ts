import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import del from 'rollup-plugin-delete'

const commonConfig = {
    plugins: [nodeResolve()],
    input: 'js/index.js',
    output: {
        globals: {
            vue: 'vue',
            THREE: 'THREE',
            three: 'three',
            lodash: 'lodash',
        },
    },
    external: [
        'lodash',
        'THREE',
        'three',
        'vue',
    ],
}


export default [
    // umd
    {
        ...commonConfig,
        plugins: [
            del({ targets: 'dist/*' }),
            ...commonConfig.plugins,
        ],
        output: {
            ...commonConfig.output,
            file: 'dist/lunchboxjs.js',
            format: 'umd',
            name: 'LunchboxRenderer',
        },
    },
    // minified umd
    {
        ...commonConfig,
        plugins: [
            ...commonConfig.plugins,
            terser(),
        ],
        output: {
            ...commonConfig.output,
            file: 'dist/lunchboxjs.min.js',
            format: 'umd',
            name: 'LunchboxRenderer',
        },
    },
    // esm module
    {
        ...commonConfig,
        output: {
            ...commonConfig.output,
            file: 'dist/lunchboxjs.module.js',
            format: 'esm',
        },
    }
]
