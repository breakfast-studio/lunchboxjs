import { defineSetupVue3 } from '@histoire/plugin-vue'
import { createApp as createLunchboxApp } from './src'
/* import Lunchbox from './src' */

export const setupVue3 = defineSetupVue3(({ app, story }) => {
  const lunchboxApp = createLunchboxApp(story.value.file.component)
  lunchboxApp.mount('#lunchbox-story')
})
