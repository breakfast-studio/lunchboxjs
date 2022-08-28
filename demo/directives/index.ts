import { createApp } from '../../src'
import App from './App.vue'
import { stencil } from './v-stencil'

createApp(App).directive('stencil', stencil).mount('#app')
