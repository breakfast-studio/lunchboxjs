import { createApp } from 'lunchboxjs'
import { App } from './App'
import { orbit } from './orbit/orbit'
import { gltf } from './gltf/gltf'

createApp(App).use(orbit).use(gltf).mount('#app')
