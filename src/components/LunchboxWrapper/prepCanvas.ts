import { MiniDom } from '../../core'
import { Ref } from 'vue'
import { resizeCanvas } from './resizeCanvas'

const getInnerDimensions = (node: Element) => {
    const computedStyle = getComputedStyle(node)
    const width = node.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight)
    const height = node.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom)
    return { width, height }
}

export const prepCanvas = (
    container: Ref<MiniDom.RendererDomNode | undefined>,
    canvasElement: HTMLCanvasElement,
    onBeforeUnmount: Function,
    sizePolicy?: String,
) => {
    const containerElement = container.value?.domElement
    if (!containerElement) throw new Error('missing container')

    // save...
    // ...and size element
    const resizeCanvasByPolicy = () => {
        if (sizePolicy === "container") {
            const dims = getInnerDimensions(containerElement);
            resizeCanvas(dims.width, dims.height);
        }
        else
            resizeCanvas()
    };
    resizeCanvasByPolicy();

    // attach listeners
    const observer = new ResizeObserver(([canvas]) => {
        resizeCanvasByPolicy();
    })
    // window.addEventListener('resize', resizeCanvas)
    if (containerElement) {
        observer.observe(containerElement)
    }

    // cleanup
    onBeforeUnmount(() => {
        if (canvasElement) {
            observer.unobserve(canvasElement)
        }
    })
}