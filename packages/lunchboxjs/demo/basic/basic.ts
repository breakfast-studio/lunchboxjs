import { createApp } from 'vue'
import { bridge } from 'lunchboxjs-plugins'
import App from './Basic.story.vue'

const app = createApp(App).use(bridge)

app.mount('#app')
