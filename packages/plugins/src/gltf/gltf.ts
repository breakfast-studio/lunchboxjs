import { Plugin } from 'vue'
import { Lunch } from 'lunchboxjs'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { GltfWrapper } from './GltfWrapper'

export const gltf: Plugin = {
    install(app) {
        const lunchboxApp = app as Lunch.App
        // register OrbitControls
        lunchboxApp.extend({ GltfLoader: GLTFLoader })
        // register wrapper component
        lunchboxApp.component('gltf', GltfWrapper)
    },
}
