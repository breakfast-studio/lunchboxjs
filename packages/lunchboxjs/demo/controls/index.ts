import { createApp } from '../../src'
import App from './App.vue'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'
import TransformControlsWrapper from './TransformControlsWrapper.vue'

const app = createApp(App)
app.extend({ TransformControls })
app.component('TransformControlsWrapper', TransformControlsWrapper)
app.mount('#app')
