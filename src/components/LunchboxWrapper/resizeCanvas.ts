import { ensuredCamera, ensureRenderer, ensuredScene } from '../../core'
import { toRaw } from 'vue'

export const resizeCanvas = (width?: number, height?: number) => {
    const renderer = ensureRenderer.value?.instance
    const scene = ensuredScene.value.instance

    // ignore if no element
    if (!renderer?.domElement || !scene) return

    width = width ?? window.innerWidth
    height = height ?? window.innerHeight

    // update camera
    const aspect = width / height
    const camera = ensuredCamera.value
    if (camera.type?.toLowerCase() === 'perspectivecamera') {
        const perspectiveCamera = camera.instance as THREE.PerspectiveCamera
        perspectiveCamera.aspect = aspect
        perspectiveCamera.updateProjectionMatrix()
    } else {
        console.log('TODO: ortho camera update')
    }

    // update canvas
    renderer.setSize(width, height)
    // render immediately so there's no flicker
    if (scene && camera.instance) {
        // const cameraInstance = scene.traverse(v => )
        renderer.render(toRaw(scene), toRaw(camera.instance))
    }
}
