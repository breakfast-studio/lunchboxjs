import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
    theme: {
        title: 'Lunchbox',
        // TODO: Add color palette and logo when available
        /*  logo: {
      light: '/logo.svg',
      dark: '/favicon-dark.svg',
    }, */
    },
    setupFile: './histoire.setup.ts',
    plugins: [HstVue()],
})
