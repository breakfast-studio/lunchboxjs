import {
    computed,
    // getCurrentInstance,
    onBeforeUnmount,
    onMounted,
    PropType,
    reactive,
    ref,
    WatchSource,
    // WritableComputedRef,
} from 'vue'
import {
    // cameraReady,
    cancelUpdate,
    cancelUpdateSource,
    // createNode,
    // ensuredCamera,
    // ensureRenderer,
    // ensuredScene,
    // fallbackCameraUuid,
    // fallbackRendererUuid,
    MiniDom,
    // rendererReady,
    // startCallbacks,
    // tryGetNodeWithInstanceType,
    update,
} from '../../core'
import { set } from 'lodash'
import { Lunch, useApp, useGlobals, useRootNode } from '../..'
import * as THREE from 'three'
import { prepCanvas } from './prepCanvas'
import { useUpdateGlobals, useStartCallbacks } from '../..'
import * as Keys from '../../keys'
// TODO: fix ts-ignore
// @ts-ignore
import LunchboxScene from './LunchboxScene.vue'

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
        // if (context.slots?.renderer?.()?.length) {
        //     renderer.value = context.slots?.renderer?.()[0].props
        //     // renderer.value = context.slots?.renderer?.()[0].ref?
        // }
        const camera = ref<Lunch.LunchboxComponent<THREE.Camera>>()
        // let scene: MiniDom.RendererStandardNode<THREE.Scene>
        const scene = ref<Lunch.LunchboxComponent<THREE.Scene>>()

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

        const consolidatedCameraProperties: Record<string, any> = reactive({})

        const startCallbacks = useStartCallbacks()

        // MOUNT
        // ====================
        onMounted(async () => {
            // canvas needs to exist
            if (!canvas.value && !context.slots?.renderer?.()?.length)
                throw new Error('missing canvas')

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
            // camera = tryGetNodeWithInstanceType([
            //     'PerspectiveCamera',
            //     'OrthographicCamera',
            // ])
            // // if not, let's create one
            // if (!camera) {
            //     // create ortho camera
            //     if (props.ortho || props.orthographic) {
            //         ensuredCamera.value = createNode<THREE.OrthographicCamera>({
            //             props: { args: props.cameraArgs ?? [] },
            //             type: 'OrthographicCamera',
            //             uuid: fallbackCameraUuid,
            //         })
            //     } else {
            //         ensuredCamera.value = createNode<THREE.PerspectiveCamera>({
            //             props: {
            //                 args: props.cameraArgs ?? [
            //                     props.r3f ? 75 : 45,
            //                     0.5625,
            //                     1,
            //                     1000,
            //                 ],
            //             },
            //             type: 'PerspectiveCamera',
            //             uuid: fallbackCameraUuid,
            //         })
            //     }

            //     cameraReady.value = true

            //     camera = ensuredCamera.value
            // } else {
            //     cameraReady.value = true
            // }
            // if (!camera.instance) {
            //     throw new Error('Error creating camera.')
            // }
            // // move camera if needed
            // if (camera && props.cameraPosition) {
            //     camera.instance.position.set(...props.cameraPosition)
            // }
            // // angle camera if needed
            // if (camera && (props.cameraLookAt || props.cameraLook)) {
            //     const source = (props.cameraLookAt || props.cameraLook)!
            //     camera.instance.lookAt(...source)
            // }
            // // zoom camera if needed
            // if (camera && props.zoom !== undefined) {
            //     ;(camera.instance as THREE.OrthographicCamera).zoom = props.zoom
            // }

            // no camera provided, so let's create one

            if (!context.slots?.camera?.()?.length) {
                if (props.cameraPosition) {
                    consolidatedCameraProperties.position = props.cameraPosition
                }
                if (props.cameraLook || props.cameraLookAt) {
                    consolidatedCameraProperties.lookAt =
                        props.cameraLook || props.cameraLookAt
                }
                if (props.zoom !== undefined) {
                    consolidatedCameraProperties.position = props.zoom
                }

                // if (props.ortho || props.orthographic) {
                //     // camera.value = (
                //     //     <orthographicCamera
                //     //         args={props.cameraArgs ?? []}
                //     //         {...consolidatedCameraProperties}
                //     //     />
                //     // ) as any
                //     // createNode<THREE.OrthographicCamera>({
                //     //     props: { args: props.cameraArgs ?? [] },
                //     //     type: 'OrthographicCamera',
                //     //     uuid: fallbackCameraUuid,
                //     // })
                // } else {
                //     camera.value = (
                //         <perspectiveCamera
                //             args={
                //                 props.cameraArgs ?? [
                //                     props.r3f ? 75 : 45,
                //                     0.5625,
                //                     1,
                //                     1000,
                //                 ]
                //             }
                //             {...consolidatedCameraProperties}
                //         />
                //     ) as any
                //     // ensuredCamera.value = createNode<THREE.PerspectiveCamera>({
                //     //     props: {
                //     //         args: props.cameraArgs ?? [
                //     //             props.r3f ? 75 : 45,
                //     //             0.5625,
                //     //             1,
                //     //             1000,
                //     //         ],
                //     //     },
                //     //     type: 'PerspectiveCamera',
                //     //     uuid: fallbackCameraUuid,
                //     // })
                // }
            }

            // SCENE
            // ====================
            // scene = ensuredScene.value
            // set background color
            if (scene.value?.$el?.instance && props.background) {
                scene.value.$el.instance.background = new THREE.Color(
                    props.background
                )
            }

            // MISC PROPERTIES
            // ====================
            if (dpr === -1) {
                dpr = window.devicePixelRatio
            }
            updateGlobals?.({ dpr })

            while (
                !renderer.value?.$el?.instance &&
                // TODO: remove `as any`
                !(renderer.value as any)?.component?.ctx.$el?.instance
            ) {
                await new Promise((r) => requestAnimationFrame(r))
            }

            while (
                !scene.value?.$el?.instance &&
                // TODO: remove `as any`
                !(scene.value as any)?.component?.ctx.$el?.instance
            ) {
                await new Promise((r) => requestAnimationFrame(r))
            }

            // if (!renderer.value?.$el?.instance) {
            //     throw new Error('missing renderer')
            // }

            const normalizedRenderer = (renderer.value?.$el?.instance ??
                (renderer.value as any)?.component?.ctx.$el
                    ?.instance) as THREE.WebGLRenderer

            normalizedRenderer.setPixelRatio(globals.dpr)

            const normalizedScene = (scene.value?.$el?.instance ??
                (scene.value as any)?.component?.ctx.$el
                    ?.instance) as THREE.Scene

            const normalizedCamera = (camera.value?.$el?.instance ??
                (camera.value as any)?.component?.ctx.$el
                    ?.instance) as THREE.Camera

            // TODO: update DPR on monitor switch
            // prep canvas (sizing, observe, unmount, etc)
            // (only run if no custom renderer)
            if (!context.slots?.renderer?.()?.length) {
                prepCanvas(
                    container,
                    normalizedRenderer,
                    normalizedScene,
                    addOnBeforeUnmount,
                    props.sizePolicy
                )

                if (props.r3f) {
                    normalizedRenderer.outputEncoding = THREE.sRGBEncoding
                    normalizedRenderer.toneMapping = THREE.ACESFilmicToneMapping
                }

                // update render sugar
                const sugar = {
                    shadow: props.shadow,
                }
                if (sugar?.shadow) {
                    normalizedRenderer.shadowMap.enabled = true
                    if (typeof sugar.shadow === 'object') {
                        normalizedRenderer.shadowMap.type = sugar.shadow.type
                    }
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

            // save renderer, scene, camera
            app.config.globalProperties.lunchbox.camera = normalizedCamera
            app.config.globalProperties.lunchbox.renderer = normalizedRenderer
            app.config.globalProperties.lunchbox.scene = normalizedScene

            for (let startCallback of startCallbacks ?? []) {
                startCallback({
                    app,
                    camera: normalizedCamera,
                    renderer: normalizedRenderer,
                    scene: normalizedScene,
                })
            }

            // KICK UPDATE
            // ====================
            update({
                app,
                camera: normalizedCamera,
                renderer: normalizedRenderer,
                scene: normalizedScene,
                updateSource: props.updateSource,
            })
        })

        // UNMOUNT
        // ====================
        onBeforeUnmount(() => {
            cancelUpdate()
            cancelUpdateSource()
        })

        // update scene as needed
        // if (context.slots?.scene?.()?.length) {
        //     watch(context.slots.scene, ([newScene]) => {
        //         console.log(newScene.component)
        //         app.config.globalProperties.lunchbox.scene = (newScene?.$el
        //             ?.instance ??
        //             (newScene as any)?.component?.ctx.$el
        //                 ?.instance) as THREE.Scene
        //     })
        // }

        // const cmpScene = computed(() => context.slots?.scene?.()[0])
        // // const sceneComponent = computed(() => cmpScene.value)
        // watch(
        //     cmpScene,
        //     (newScene) => {
        //         // console.log(newScene)
        //         // app!
        //         // console.log(newScene)
        //         // app!.config.globalProperties.lunchbox.scene =
        //         //     newScene?.$el?.instance
        //     },
        //     { deep: true }
        // )
        // const sceneInt = ref()
        // watch(sceneInt, (v) => {
        //     console.log(v.component, v.el, v.children)
        // })

        const visibleScene = computed(() => context.slots?.scene?.()[0])
        if (context.slots?.scene?.()?.length) {
            // watch(
            //     visibleScene,
            //     (newValue) => {
            //         scene.value = newValue
            //         console.log(scene.value)
            //         // app!.config.globalProperties.lunchbox.scene = newValue
            //     },
            //     { immediate: true }
            // )
        }

        // RENDER FUNCTION
        // ====================
        const containerFillStyle =
            props.sizePolicy === 'container' ? 'static' : 'absolute'
        const canvasFillStyle =
            props.sizePolicy === 'container' ? 'static' : 'fixed'

        return () => (
            <>
                {/* use renderer slot if provided... */}
                {context.slots?.renderer?.()?.length ? (
                    // TODO: remove `as any` cast
                    (renderer.value = context.slots?.renderer?.()[0] as any)
                ) : (
                    // ...otherwise, add canvas...
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
                        {/* ...and create default renderer once canvas is present */}
                        {canvas.value?.domElement && (
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
                        )}
                    </>
                )}

                {/* use scene slot if provided... */}
                {context.slots?.scene?.()?.length ? (
                    // TODO: remove `as any` cast
                    (scene.value = context.slots?.scene?.()[0] as any)
                ) : (
                    // ...otherwise, add default scene
                    // TODO: why does this need to be a separate component? <scene> throws an error
                    <LunchboxScene ref={scene}>
                        {context.slots?.default?.()}
                    </LunchboxScene>
                )}

                {/* use camera slot if provided... */}
                {context.slots?.camera?.()?.length ? (
                    // TODO: remove `any` cast
                    (camera.value = context.slots?.camera?.()[0] as any)
                ) : props.ortho || props.orthographic ? (
                    <orthographicCamera
                        ref={camera}
                        args={props.cameraArgs ?? []}
                        {...consolidatedCameraProperties}
                    />
                ) : (
                    <perspectiveCamera
                        ref={camera}
                        args={
                            props.cameraArgs ?? [
                                props.r3f ? 75 : 45,
                                0.5625,
                                1,
                                1000,
                            ]
                        }
                        {...consolidatedCameraProperties}
                    />
                )}
            </>
        )
    },
})
