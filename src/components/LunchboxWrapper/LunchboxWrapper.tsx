import {
    getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    PropType,
    reactive,
    ref,
    WatchSource,
    WritableComputedRef,
} from 'vue'
import {
    cameraReady,
    cancelUpdate,
    cancelUpdateSource,
    createNode,
    ensuredCamera,
    // ensureRenderer,
    ensuredScene,
    fallbackCameraUuid,
    // fallbackRendererUuid,
    MiniDom,
    // rendererReady,
    startCallbacks,
    tryGetNodeWithInstanceType,
    update,
} from '../../core'
import { set } from 'lodash'
import { Lunch, useApp, useGlobals, useRootNode } from '../..'
import * as THREE from 'three'
import { prepCanvas } from './prepCanvas'
import { useUpdateGlobals } from '../..'
import * as Keys from '../../keys'

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
        display: 'block',
    }
}

import { defineComponent, watch } from 'vue'

export const LunchboxWrapper = defineComponent({
    name: 'Lunchbox',
    props: {
        // These should match the Lunchbox.WrapperProps interface
        background: String,
        cameraArgs: Array,
        cameraLook: Array as unknown as PropType<Lunch.Vector3AsArray>,
        cameraLookAt: Array as unknown as PropType<Lunch.Vector3AsArray>,
        cameraPosition: Array as unknown as PropType<Lunch.Vector3AsArray>,
        dpr: Number,
        ortho: Boolean,
        orthographic: Boolean,
        r3f: Boolean,
        rendererArguments: Object,
        rendererProperties: Object,
        sizePolicy: String as PropType<Lunch.SizePolicy>,
        shadow: [Boolean, Object],
        transparent: Boolean,
        zoom: Number,
        updateSource: Object as PropType<WatchSource>,
    },
    setup(props, context) {
        const canvas = ref<MiniDom.RendererDomNode>()
        const useFallbackRenderer = ref(true)
        let dpr = props.dpr ?? -1
        const container = ref<MiniDom.RendererDomNode>()
        // let renderer: Lunch.Node<THREE.WebGLRenderer> | null
        const renderer = ref<Lunch.LunchboxComponent<THREE.Renderer>>()
        let camera: Lunch.Node<THREE.Camera> | null
        let scene: MiniDom.RendererStandardNode<THREE.Scene>

        const globals = useGlobals()
        const updateGlobals = useUpdateGlobals()
        let rendererArgs: THREE.WebGLRendererParameters = reactive({
            alpha: props.transparent,
            antialias: true,
            canvas: canvas.value?.domElement,
            powerPreference: !!props.r3f ? 'high-performance' : 'default',
            ...(props.rendererArguments ?? {}),
        })

        const root = useRootNode()
        const app = useApp()

        // https://threejs.org/docs/index.html#manual/en/introduction/Color-management
        if (props.r3f && (THREE as any)?.ColorManagement) {
            ;(THREE as any).ColorManagement.legacyMode = false
        }

        const addOnBeforeUnmount = (func: () => void) => onBeforeUnmount(func)

        // MOUNT
        // ====================
        onMounted(async () => {
            // canvas needs to exist
            if (!canvas.value) throw new Error('missing canvas')

            // RENDERER
            // ====================
            // is there already a renderer?
            // TODO: allow other renderer types
            // console.log(root)
            // renderer.value =
            // tryGetNodeWithInstanceType([
            //     'WebGLRenderer',
            // ]) as unknown as Lunch.Node<THREE.WebGLRenderer> | null
            // console.log(renderer.value)

            // if renderer is missing, initialize with options
            /*
            if (!renderer) {
                // build renderer args
                rendererArgs = {
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
                // renderer = rendererAsWebGlRenderer.value
            } else {
                useFallbackRenderer.value = false
                // the user has initialized the renderer, so anything depending
                // on the renderer can execute
                rendererReady.value = true
            }
            */

            // update using created renderer
            // renderer = rendererAsWebGlRenderer.value

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
            if (dpr === -1) {
                dpr = window.devicePixelRatio
            }
            updateGlobals?.({ dpr })

            while (!renderer.value?.$el?.instance) {
                await new Promise((r) => requestAnimationFrame(r))
            }
            // if (!renderer.value?.$el?.instance) {
            //     throw new Error('missing renderer')
            // }

            const rendererAsWebGlRenderer = renderer.value?.$el
                ?.instance as THREE.WebGLRenderer

            rendererAsWebGlRenderer.setPixelRatio(globals.dpr)
            // TODO: update DPR on monitor switch
            // prep canvas (sizing, observe, unmount, etc)
            prepCanvas(
                container,
                renderer.value.$el.instance,
                addOnBeforeUnmount,
                props.sizePolicy
            )

            if (props.r3f) {
                rendererAsWebGlRenderer.outputEncoding = THREE.sRGBEncoding
                rendererAsWebGlRenderer.toneMapping =
                    THREE.ACESFilmicToneMapping
            }

            // update render sugar
            const sugar = {
                shadow: props.shadow,
            }
            if (sugar?.shadow) {
                rendererAsWebGlRenderer.shadowMap.enabled = true
                if (typeof sugar.shadow === 'object') {
                    rendererAsWebGlRenderer.shadowMap.type = sugar.shadow.type
                }
            }

            // set renderer props if needed
            // if (props.rendererProperties) {
            //     Object.keys(props.rendererProperties).forEach((key) => {
            //         set(
            //             rendererAsWebGlRenderer,
            //             key,
            //             (props.rendererProperties as any)[key]
            //         )
            //     })
            // }

            // CALLBACK PREP
            // ====================
            // const app = getCurrentInstance()!.appContext.app as Lunch.App

            // START
            // ====================
            if (!app) {
                throw new Error('error creating app')
            }

            // provide renderer
            app.config.globalProperties.lunchbox.renderer =
                renderer.value.$el.instance

            for (let startCallback of startCallbacks) {
                startCallback({
                    app,
                    camera: camera.instance,
                    renderer: renderer.value?.$el?.instance,
                    scene: scene.instance,
                })
            }

            // KICK UPDATE
            // ====================
            update({
                app,
                camera: camera.instance,
                renderer: renderer.value?.$el?.instance,
                scene: scene.instance,
                updateSource: props.updateSource,
            })
        })

        // UNMOUNT
        // ====================
        onBeforeUnmount(() => {
            cancelUpdate()
            cancelUpdateSource()
        })

        // RENDER FUNCTION
        // ====================
        const containerFillStyle =
            props.sizePolicy === 'container' ? 'static' : 'absolute'
        const canvasFillStyle =
            props.sizePolicy === 'container' ? 'static' : 'fixed'

        return () => (
            <>
                <div
                    class="lunchbox-container"
                    style={fillStyle(containerFillStyle) as any}
                    ref={container}
                    data-lunchbox="true"
                >
                    <canvas
                        ref={canvas}
                        class="lunchbox-canvas"
                        style={fillStyle(canvasFillStyle) as any}
                        data-lunchbox="true"
                    ></canvas>
                </div>
                {canvas.value?.domElement &&
                    (context.slots?.renderer?.() ?? (
                        <>
                            {
                                <webGLRenderer
                                    {...(props.rendererProperties ?? {})}
                                    ref={renderer}
                                    args={[
                                        {
                                            alpha: props.transparent,
                                            antialias: true,
                                            canvas: canvas.value?.domElement,
                                            powerPreference: !!props.r3f
                                                ? 'high-performance'
                                                : 'default',
                                            ...(props.rendererArguments ?? {}),
                                        },
                                    ]}
                                />
                            }
                        </>
                    ))}

                {context.slots?.default?.()}
            </>
        )
    },
})
