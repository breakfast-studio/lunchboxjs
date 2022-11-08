import { Plugin } from 'vue'
import { Lunch } from 'lunchboxjs'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OrbitControlsWrapper } from './OrbitControlsWrapper'

export const orbit: Plugin = {
    install(app) {
        const lunchboxApp = app as Lunch.App
        // register OrbitControls
        lunchboxApp.extend({ OrbitControls })
        // register wrapper component
        lunchboxApp.component('orbit', OrbitControlsWrapper)
    },
}
