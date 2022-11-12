import { createApp } from '../../src'
import App from './App.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import OrbitControlsWrapper from '../../extras/OrbitControlsWrapper.vue'

const app = createApp(App)

app.extend({ OrbitControls })
    .component('OrbitControlsWrapper', OrbitControlsWrapper)
    .mount('#app')
