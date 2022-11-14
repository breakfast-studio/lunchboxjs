import { defineSetupVue3 } from '@histoire/plugin-vue'
// import { createApp as createLunchboxApp } from './src'
/* import Lunchbox from './src' */
import { BridgeComponent } from 'lunchboxjs-plugins'

export const setupVue3 = defineSetupVue3(({ app, story }) => {
    app.component('lunchbox', BridgeComponent)
    // app.use(bridge)
    // console.log(bridge)
    // console.log(app, story)
    // const lunchboxApp = createLunchboxApp(story.value.file.component)
    // lunchboxApp.mount('#lunchbox-story')
})
