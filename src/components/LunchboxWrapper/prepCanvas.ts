import { MiniDom } from '../../core'
import { Ref } from 'vue'
import { resizeCanvas } from './resizeCanvas'

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
        if (sizePolicy === "container")
            resizeCanvas(containerElement.clientWidth, containerElement.clientHeight);
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