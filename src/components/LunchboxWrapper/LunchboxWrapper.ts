import {
    h,
    ComponentOptions,
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    ref,
    WritableComputedRef,
} from 'vue'
import {
    cameraReady,
    cancelUpdate,
    createNode,
    ensuredCamera,
    ensureRenderer,
    ensuredScene,
    fallbackCameraUuid,
    fallbackRendererUuid,
    MiniDom,
    rendererReady,
    tryGetNodeWithInstanceType,
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
        cameraArgs: Array,
        cameraPosition: Array,
        dpr: Number,
        ortho: Boolean,
        orthographic: Boolean,
        rendererProperties: Object,
        shadow: [Boolean, Object],
        transparent: Boolean,
    },
    setup(props: Lunch.WrapperProps, context) {
        const canvas = ref<MiniDom.RendererDomNode>()
        const useFallbackRenderer = ref(true)
        const dpr = ref(props.dpr ?? -1)
        const container = ref<MiniDom.RendererDomNode>()
        let renderer: Lunch.Node<THREE.WebGLRenderer> | null
        let camera: Lunch.Node<THREE.Camera> | null
        let scene: MiniDom.RendererStandardNode<THREE.Scene>

        // MOUNT
        // ====================
        onMounted(() => {
            // canvas needs to exist
            if (!canvas.value) throw new Error('missing canvas')

            // CAMERA
            // ====================
            // is there already a camera?
            camera = tryGetNodeWithInstanceType([
                'PerspectiveCamera',
                'OrthographicCamera',
            ])
            // if not, let's create one
            if (!camera) {
                // create ortho camera
                if (props.ortho || props.orthographic) {
                    ensuredCamera.value = createNode<THREE.OrthographicCamera>({
                        props: { args: props.cameraArgs ?? [] },
                        type: 'OrthographicCamera',
                        uuid: fallbackCameraUuid,
                    })
                } else {
                    ensuredCamera.value = createNode<THREE.PerspectiveCamera>({
                        props: {
                            args: props.cameraArgs ?? [45, 0.5625, 1, 1000],
                        },
                        type: 'PerspectiveCamera',
                        uuid: fallbackCameraUuid,
                    })
                }

                cameraReady.value = true

                camera = ensuredCamera.value
            } else {
                cameraReady.value = true
            }
            // move camera if needed
            if (camera && props.cameraPosition) {
                camera.instance?.position.set(...props.cameraPosition)
            }

            // RENDERER
            // ====================
            // is there already a renderer?
            // TODO: allow other renderer types
            renderer = tryGetNodeWithInstanceType([
                'WebGLRenderer',
            ]) as unknown as Lunch.Node<THREE.WebGLRenderer> | null

            // if renderer is missing, initialize with options
            if (!renderer) {
                // build renderer args
                const rendererArgs: THREE.WebGLRendererParameters = {
                    antialias: true,
                    canvas: canvas.value.domElement,
                }
                if (props.transparent) {
                    rendererArgs.alpha = true
                }

                // create new renderer
                ensureRenderer.value = createNode<THREE.WebGLRenderer>({
                    type: 'WebGLRenderer',
                    uuid: fallbackRendererUuid,
                    props: {
                        args: [rendererArgs],
                    },
                })

                // we've initialized the renderer, so anything depending on it can execute now
                rendererReady.value = true

                const rendererAsWebGlRenderer =
                    ensureRenderer as WritableComputedRef<
                        Lunch.Node<THREE.WebGLRenderer>
                    >

                // update render sugar
                const sugar = {
                    shadow: props.shadow,
                }
                if (rendererAsWebGlRenderer.value.instance && sugar?.shadow) {
                    rendererAsWebGlRenderer.value.instance.shadowMap.enabled =
                        true
                    if (typeof sugar.shadow === 'object') {
                        rendererAsWebGlRenderer.value.instance.shadowMap.type =
                            sugar.shadow.type
                    }
                }

                // set renderer props if needed
                if (props.rendererProperties) {
                    Object.keys(props.rendererProperties).forEach((key) => {
                        set(
                            rendererAsWebGlRenderer.value,
                            key,
                            (props.rendererProperties as any)[key]
                        )
                    })
                }

                // update using created renderer
                renderer = rendererAsWebGlRenderer.value
            } else {
                useFallbackRenderer.value = false
                // the user has initialized the renderer, so anything depending
                // on the renderer can execute
                rendererReady.value = true
                return
            }

            // SCENE
            // ====================
            scene = ensuredScene.value
            // set background color
            if (scene && scene.instance && props.background) {
                scene.instance.background = new Color(props.background)
            }

            // MISC PROPERTIES
            // ====================
            if (dpr.value === -1) {
                dpr.value = window.devicePixelRatio
            }

            if (renderer?.instance) {
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
            // console.log(scene)
            update({
                app: getCurrentInstance()!.appContext.app as Lunch.App,
                camera: camera.instance,
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
