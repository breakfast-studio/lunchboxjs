import { ensuredCamera, ensureRenderer, ensuredScene } from '../../core'
import { toRaw } from 'vue'

export const resizeCanvas = (width?: number, height?: number) => {
    const renderer = ensureRenderer.value?.instance
    const scene = ensuredScene.value.instance
    const camera = ensuredCamera.value

    // ignore if no element
    if (!renderer?.domElement || !scene || !camera) return

    width = width ?? window.innerWidth
    height = height ?? window.innerHeight

    // update camera
    const aspect = width / height
    if (camera.type?.toLowerCase() === 'perspectivecamera') {
        const perspectiveCamera = camera.instance as THREE.PerspectiveCamera
        perspectiveCamera.aspect = aspect
        perspectiveCamera.updateProjectionMatrix()
    } else if (camera.type?.toLowerCase() === 'orthographiccamera') {
        console.log('TODO: ortho camera update')
    } else {
        console.log('TODO: non-ortho or perspective camera')
    }

    // update canvas
    renderer.setSize(width, height)
    // render immediately so there's no flicker
    if (scene && camera.instance) {
        renderer.render(toRaw(scene), toRaw(camera.instance))
    }
}
