import { createApp } from '../../'
import App from './App.vue'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry'
import { orbit } from 'lunchboxjs-plugins'

const app = createApp(App).use(orbit).extend({ RoundedBoxGeometry })

app.mount('#app')
