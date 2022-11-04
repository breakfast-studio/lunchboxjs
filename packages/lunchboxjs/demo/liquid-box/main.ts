import { createApp } from '../../src'
import App from './App.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

createApp(App)
    .extend({ OrbitControls })
    .mount('#app')

