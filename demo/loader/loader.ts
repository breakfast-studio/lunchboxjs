import { createApp } from '../../src'
import App from './LoaderTest.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const app = createApp(App)
app.extend({ OrbitControls })

app.mount('#app')
