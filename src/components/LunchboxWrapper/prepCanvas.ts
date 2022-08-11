import { MiniDom } from '../../core'
import { Lunch } from '../../types'
import { Ref } from 'vue'
import { resizeCanvas } from './resizeCanvas'

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
    renderer: THREE.Renderer,
    scene: THREE.Scene,
    onBeforeUnmount: Function,
    sizePolicy?: Lunch.SizePolicy
) => {
    const containerElement = container.value?.domElement
    if (!containerElement) throw new Error('missing container')

    // save...
    // ...and size element
    const resizeCanvasByPolicy = () => {
        if (sizePolicy === 'container') {
            const dims = getInnerDimensions(containerElement)
            resizeCanvas(renderer, scene, dims.width, dims.height)
        } else resizeCanvas(renderer, scene)
    }
    resizeCanvasByPolicy()

    // attach listeners
    const observer = new ResizeObserver(([canvas]) => {
        resizeCanvasByPolicy()
    })
    // window.addEventListener('resize', resizeCanvas)
    if (containerElement) {
        observer.observe(containerElement)
    }

    // cleanup
    // onBeforeUnmount(() => {
    //     if (canvasElement) {
    //         observer.unobserve(canvasElement)
    //     }
    // })
}
