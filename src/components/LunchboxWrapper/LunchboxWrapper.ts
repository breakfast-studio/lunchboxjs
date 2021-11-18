import {
    h,
    ComponentOptions,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    ref,
} from 'vue'
import {
    cancelUpdate,
    ensureCamera,
    ensureRenderer,
    ensureScene,
    fallbackRendererUuid,
    MiniDom,
    update,
} from '../../core'
import { set } from 'lodash'
import { globals, Lunch } from '../..'
import { Color } from 'three'
import { prepCanvas } from './prepCanvas'

/** fixed & fill styling for container */
const fillStyle = (position: string) => {
    return {
        position,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
    }
}

export const LunchboxWrapper: ComponentOptions = {
    name: 'Lunchbox',
    props: {
        // These should match the Lunchbox.WrapperProps interface
        background: String,
        cameraPosition: Array,
        dpr: Number,
        rendererProperties: Object,
        shadow: [Boolean, Object],
        transparent: Boolean,
    },
    setup(props: Lunch.WrapperProps, context) {
        const canvas = ref<MiniDom.RendererDomNode>()
        const useFallbackRenderer = ref(true)
        const dpr = ref(props.dpr ?? -1)
        const container = ref<MiniDom.RendererDomNode>()
        let renderer: MiniDom.RendererStandardNode<THREE.WebGLRenderer>
        let scene: MiniDom.RendererStandardNode<THREE.Scene>

        // MOUNT
        // ====================
        onMounted(() => {
            // canvas needs to exist
            if (!canvas.value) throw new Error('missing canvas')

            // ensure camera
            const camera = ensureCamera().instance
            // move camera if needed
            if (camera && props.cameraPosition) {
                camera.position.set(...props.cameraPosition)
            }

            // RENDERER
            // ====================
            // build renderer args
            const rendererArgs: THREE.WebGLRendererParameters = {
                antialias: true,
                canvas: canvas.value.domElement,
            }
            if (props.transparent) {
                rendererArgs.alpha = true
            }
            const sugar = {
                shadow: props.shadow,
            }
            // ensure renderer
            renderer = ensureRenderer([rendererArgs], sugar)
            // set renderer props if needed
            if (props.rendererProperties) {
                Object.keys(props.rendererProperties).forEach((key) => {
                    set(renderer, key, (props.rendererProperties as any)[key])
                })
            }
            if (renderer.uuid !== fallbackRendererUuid) {
                useFallbackRenderer.value = false
                return
            }

            // SCENE
            // ====================
            scene = ensureScene()
            // set background color
            if (scene && scene.instance && props.background) {
                scene.instance.background = new Color(props.background)
            }

            // MISC PROPERTIES
            // ====================
            if (dpr.value === -1) {
                dpr.value = window.devicePixelRatio
            }

            if (renderer.instance) {
                renderer.instance.setPixelRatio(dpr.value)
                globals.dpr.value = dpr.value
                // prep canvas (sizing, observe, unmount, etc)
                prepCanvas(
                    container,
                    renderer.instance.domElement,
                    onBeforeUnmount
                )
            } else {
                throw new Error('missing renderer')
            }

            // KICK UPDATE
            // ====================
            update({
                app: getCurrentInstance()!.appContext.app as Lunch.App,
                camera,
                renderer: renderer.instance,
                scene: scene.instance,
            })
        })

        // UNMOUNT
        // ====================
        onBeforeUnmount(() => {
            cancelUpdate()
        })

        // RENDER FUNCTION
        // ====================
        return () => [
            context.slots.default?.() ?? null,
            h(
                'div',
                {
                    style: fillStyle('absolute'),
                    ref: container,
                },
                [
                    useFallbackRenderer.value
                        ? h('canvas', {
                              style: fillStyle('fixed'),
                              class: 'lunchbox-canvas',
                              ref: canvas,
                          })
                        : null,
                ]
            ),
        ]
    },
}
