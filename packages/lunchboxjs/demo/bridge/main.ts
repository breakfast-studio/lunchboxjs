import { createApp } from 'vue'
import { lunchbox } from '../../src'
import App from './HtmlApp.vue'

createApp(App).use(lunchbox).mount('#app')
