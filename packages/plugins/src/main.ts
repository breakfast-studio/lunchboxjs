import { createApp } from 'lunchboxjs'
import { App } from './App'
import { orbit } from './orbit'

createApp(App).use(orbit).mount('#app')
