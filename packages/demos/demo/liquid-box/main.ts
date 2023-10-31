import { createApp } from '../../'
import App from './App.vue'
import { orbit } from 'lunchboxjs-plugins'

createApp(App).use(orbit).mount('#app')
