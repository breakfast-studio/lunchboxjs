import { createApp } from 'lunchboxjs'
import App from './LoaderTest.vue'
import { orbit } from 'lunchboxjs-plugins'

const app = createApp(App)
app.use(orbit)

app.mount('#app')
