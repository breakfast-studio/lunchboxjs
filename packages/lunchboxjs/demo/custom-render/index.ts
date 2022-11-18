import { createApp } from '../../'
import App from './App.vue'
import { orbit } from 'lunchboxjs-plugins'

const app = createApp(App)
app.use(orbit)

app.mount('#app')
