import { createApp } from '../../src'
import App from './App.vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'

const app = createApp(App).extend({ OrbitControls, RoundedBoxGeometry })

app.mount('#app')
