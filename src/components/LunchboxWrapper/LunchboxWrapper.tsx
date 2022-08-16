import {
    defineComponent,
    onBeforeUnmount,
    onMounted,
    PropType,
    reactive,
    ref,
    WatchSource,
} from 'vue'
import { cancelUpdate, cancelUpdateSource, MiniDom, update } from '../../core'
import { Lunch, useApp, useGlobals } from '../..'
import * as THREE from 'three'
import { prepCanvas } from './prepCanvas'
import { useUpdateGlobals, useStartCallbacks } from '../..'
import { LunchboxScene } from './LunchboxScene'

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
        let dpr = props.dpr ?? -1
        const container = ref<MiniDom.RendererDomNode>()
        const renderer = ref<Lunch.LunchboxComponent<THREE.Renderer>>()
        const camera = ref<Lunch.LunchboxComponent<THREE.Camera>>()
        const scene = ref<Lunch.LunchboxComponent<THREE.Scene>>()
        const globals = useGlobals()
        const updateGlobals = useUpdateGlobals()
        const app = useApp()
        const consolidatedCameraProperties: Record<string, any> = reactive({})
        const startCallbacks = useStartCallbacks()

        // https://threejs.org/docs/index.html#manual/en/introduction/Color-management
        if (props.r3f && (THREE as any)?.ColorManagement) {
            ;(THREE as any).ColorManagement.legacyMode = false
        }

        // MOUNT
        // ====================
        onMounted(async () => {
            // canvas needs to exist (or user needs to handle it on their own)
            if (!canvas.value && !context.slots?.renderer?.()?.length)
                throw new Error('missing canvas')

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
                    consolidatedCameraProperties.zoom = props.zoom
                }
            }

            // SCENE
            // ====================
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

            console.log(1)
            while (
                !renderer.value?.$el?.instance &&
                // TODO: remove `as any`
                !(renderer.value as any)?.component?.ctx.$el?.instance
            ) {
                console.log(2)
                await new Promise((r) => requestAnimationFrame(r))
            }

            console.log(3)
            while (
                !scene.value?.$el?.instance &&
                // TODO: remove `as any`
                !(scene.value as any)?.component?.ctx.$el?.instance
            ) {
                console.log(4)
                await new Promise((r) => requestAnimationFrame(r))
            }
            console.log(5)

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
                // TODO: use dispose
                const { dispose } = prepCanvas(
                    container,
                    normalizedCamera,
                    normalizedRenderer,
                    normalizedScene,
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
