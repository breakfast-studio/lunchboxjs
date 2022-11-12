import { createApp } from '../../src'
import App from './App.vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Gltf from '../../extras/Gltf.vue'

createApp(App)
    .extend({ GltfLoader: GLTFLoader })
    .mount('#app')
