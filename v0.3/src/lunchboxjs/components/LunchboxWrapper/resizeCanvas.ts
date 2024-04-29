import * as THREE from 'three';

export const resizeCanvas = (
    camera: THREE.Camera,
    renderer: THREE.Renderer,
    scene: THREE.Scene,
    width?: number,
    height?: number
) => {
    // ignore if no element
    if (!renderer?.domElement || !scene || !camera) return

    width = width ?? window.innerWidth
    height = height ?? window.innerHeight

    // update camera
    const aspect = width / height;
    if (camera.type?.toLowerCase() === 'perspectivecamera') {
        const perspectiveCamera = camera as THREE.PerspectiveCamera
        perspectiveCamera.aspect = aspect
        perspectiveCamera.updateProjectionMatrix()
    } else if (camera.type?.toLowerCase() === 'orthographiccamera') {
        // TODO: ortho camera update
        const orthoCamera = camera as THREE.OrthographicCamera
        const heightInTermsOfWidth = height / width
        orthoCamera.top = heightInTermsOfWidth * 10
        orthoCamera.bottom = -heightInTermsOfWidth * 10
        orthoCamera.right = 10
        orthoCamera.left = -10
        orthoCamera.updateProjectionMatrix()
    } else {
        // TODO: non-ortho or perspective camera
    }

    // update canvas
    renderer.setSize(width, height)
    // render immediately so there's no flicker
    if (scene && camera) {
        renderer.render(scene, camera)
    }
}
