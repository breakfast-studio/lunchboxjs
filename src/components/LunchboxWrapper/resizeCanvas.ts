import { ensureCamera, ensureRenderer, ensureScene } from '../../core'

export const resizeCanvas = (width?: number, height?: number) => {
    const renderer = ensureRenderer().instance
    const scene = ensureScene().instance

    // ignore if no element
    if (!renderer?.domElement || !scene) return

    width = width ?? window.innerWidth
    height = height ?? window.innerHeight

    // update camera
    const aspect = width / height
    const camera = ensureCamera()
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
        renderer.render(scene, camera.instance)
    }
}
