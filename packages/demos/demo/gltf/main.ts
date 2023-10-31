import { createApp } from '../..'
import App from './App.vue'
import { gltf } from 'lunchboxjs-plugins'

createApp(App).use(gltf).mount('#app')
