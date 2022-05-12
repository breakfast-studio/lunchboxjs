import { config } from './vite.config'
import { defineConfig, UserConfigExport } from 'vite'

// config
const testConfig: UserConfigExport = {
    ...config,
    server: {
        port: 5555,
    },
}

export default defineConfig(testConfig)
