import { MiniDom } from '../../core'
import { Lunch } from '../../types'
import { Ref } from 'vue'
import { resizeCanvas } from './resizeCanvas'
import * as THREE from 'three'

const getInnerDimensions = (node: Element) => {
    const computedStyle = getComputedStyle(node)
    const width =
        node.clientWidth -
        parseFloat(computedStyle.paddingLeft) -
        parseFloat(computedStyle.paddingRight)
    const height =
        node.clientHeight -
        parseFloat(computedStyle.paddingTop) -
        parseFloat(computedStyle.paddingBottom)
    return { width, height }
}

export const prepCanvas = (
    container: Ref<MiniDom.RendererDomNode | undefined>,
    camera: THREE.Camera,
    renderer: THREE.Renderer,
    scene: THREE.Scene,
    sizePolicy?: Lunch.SizePolicy
) => {
    const containerElement = container.value?.domElement
    if (!containerElement) throw new Error('missing container')

    // save and size element
    const resizeCanvasByPolicy = () => {
        if (sizePolicy === 'container') {
            const dims = getInnerDimensions(containerElement)
            resizeCanvas(camera, renderer, scene, dims.width, dims.height)
        } else resizeCanvas(camera, renderer, scene)
    }
    resizeCanvasByPolicy()

    // attach listeners
    let observer = new ResizeObserver(() => {
        resizeCanvasByPolicy()
    })
    // window.addEventListener('resize', resizeCanvas)
    if (containerElement) {
        observer.observe(containerElement)
    }

    // cleanup
    return {
        dispose() {
            if (containerElement) {
                observer.unobserve(containerElement)
            }
        },
    }
}
