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
    startCallbacks,
    tryGetNodeWithInstanceType,
    update,
} from '../../core'
import { set } from 'lodash'
import { globals, Lunch } from '../..'
// import { Color, Vector2, sRGBEncoding, ACESFilmicToneMapping } from 'three'
import * as THREE from 'three'
import { prepCanvas } from './prepCanvas'

// TODO:
// Continue r3f prop - what else (besides camera fov) makes r3f look good?

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
        cameraLook: Array,
        cameraLookAt: Array,
        cameraPosition: Array,
        dpr: Number,
        ortho: Boolean,
        orthographic: Boolean,
        r3f: Boolean,
        rendererArguments: Object,
        rendererProperties: Object,
        shadow: [Boolean, Object],
        transparent: Boolean,
        zoom: Number,
    },
    setup(props: Lunch.WrapperProps, context) {
        const canvas = ref<MiniDom.RendererDomNode>()
        const useFallbackRenderer = ref(true)
        const dpr = ref(props.dpr ?? -1)
        const container = ref<MiniDom.RendererDomNode>()
        let renderer: Lunch.Node<THREE.WebGLRenderer> | null
        let camera: Lunch.Node<THREE.Camera> | null
        let scene: MiniDom.RendererStandardNode<THREE.Scene>

        // https://threejs.org/docs/index.html#manual/en/introduction/Color-management
        if (props.r3f && (THREE as any)?.ColorManagement) {
            ;(THREE as any).ColorManagement.legacyMode = false
        }

        // MOUNT
        // ====================
        onMounted(() => {
            // canvas needs to exist
            if (!canvas.value) throw new Error('missing canvas')

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
                    alpha: props.transparent,
                    antialias: true,
                    canvas: canvas.value.domElement,
                    powerPreference: !!props.r3f
                        ? 'high-performance'
                        : 'default',
                    ...(props.rendererArguments ?? {}),
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

                // apply r3f settings if desired
                if (props.r3f) {
                    if (rendererAsWebGlRenderer.value.instance) {
                        rendererAsWebGlRenderer.value.instance.outputEncoding =
                            THREE.sRGBEncoding
                        rendererAsWebGlRenderer.value.instance.toneMapping =
                            THREE.ACESFilmicToneMapping
                    }
                }

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
            }

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
                            args: props.cameraArgs ?? [
                                props.r3f ? 75 : 45,
                                0.5625,
                                1,
                                1000,
                            ],
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
            if (!camera.instance) {
                throw new Error('Error creating camera.')
            }
            // move camera if needed
            if (camera && props.cameraPosition) {
                camera.instance.position.set(...props.cameraPosition)
            }
            // angle camera if needed
            if (camera && (props.cameraLookAt || props.cameraLook)) {
                const source = (props.cameraLookAt || props.cameraLook)!
                camera.instance.lookAt(...source)
            }
            // zoom camera if needed
            if (camera && props.zoom !== undefined) {
                ;(camera.instance as THREE.OrthographicCamera).zoom = props.zoom
            }

            // SCENE
            // ====================
            scene = ensuredScene.value
            // set background color
            if (scene && scene.instance && props.background) {
                scene.instance.background = new THREE.Color(props.background)
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

            // CALLBACK PREP
            // ====================
            const app = getCurrentInstance()!.appContext.app as Lunch.App

            // START
            // ====================
            for (let startCallback of startCallbacks) {
                startCallback({
                    app,
                    camera: camera.instance,
                    renderer: renderer.instance,
                    scene: scene.instance,
                })
            }

            // KICK UPDATE
            // ====================
            update({
                app,
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
