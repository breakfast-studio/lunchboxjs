import { ComputedRef, inject } from 'vue'
import * as Keys from '../keys'

export const ensuredCamera = <T extends THREE.Camera = THREE.Camera>() =>
    inject<ComputedRef<T>>(Keys.appCameraKey)!

// ENSURE RENDERER
// ====================
export const ensureRenderer = <
    T extends THREE.Renderer = THREE.WebGLRenderer
>() => inject<ComputedRef<T>>(Keys.appRenderersKey)

// ENSURE SCENE
// ====================
export const ensuredScene = <T extends THREE.Scene = THREE.Scene>() =>
    inject<ComputedRef<T>>(Keys.appSceneKey)
