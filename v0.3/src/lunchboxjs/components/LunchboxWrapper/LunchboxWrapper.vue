<template>
    <!-- Renderer slot -->
    <slot name="renderer">
        <!-- Default renderer container -->
        <div class="lunchbox-container" :style="fillStyle(containerFillStyle)" ref="container" data-lunchbox="true">
            <!-- Default renderer canvas -->
            <canvas ref="canvas" class="lunchbox-canvas" :style="fillStyle(canvasFillStyle)"
                data-lunchbox="true"></canvas>

            <!-- Default renderer -->
            <webGLRenderer ref="renderer" v-if="canvas?.domElement" :args="[{
            canvas: canvas.domElement,
            alpha: !!props.transparent,
            antialias: true,
            powerPreference: !!props.r3f
                ? 'high-performance'
                : 'default',
            ...(props.rendererArguments ?? {}),
        }]" />

        </div>


    </slot>

    <!-- Scene slot -->
    <slot name="scene">
        <LunchboxScene ref="scene">
            <slot name="default"></slot>
        </LunchboxScene>
    </slot>

    <!-- Camera slot -->
    <slot name="camera">
        <orthographicCamera key="ortho" v-if="props.ortho || props.orthographic" ref="camera"
            :args="props.cameraArgs ?? []" v-bind="toRaw(consolidatedCameraProperties)"
            :position="props.cameraPosition ?? []" />
        <perspectiveCamera key="perspective" v-else ref="camera" :args="[
            props.r3f ? 75 : 45,
            1.2,
            0.1,
            1000,
        ]" :position="props.cameraPosition ?? []" />
    </slot>

</template>

<script lang="ts" setup>
import {
    // computed,
    CSSProperties,
    onMounted,
    // defineComponent,
    // onBeforeUnmount,
    // onMounted,
    // PropType,
    reactive,
    ref,
    StyleValue,
    toRaw,
    useSlots,
    watch,
    // watch,
    // WatchSource,
} from 'vue'
// import { cancelUpdate, cancelUpdateSource, MiniDom, update } from '../../core'
import {
    // getInstance,
    Lunch,
    update,
    useApp,
    // useApp, useGlobals, useLunchboxInteractables 
} from '../..'
import * as THREE from 'three'
import LunchboxScene from './LunchboxScene.vue';
// import { prepCanvas } from './prepCanvas'
import { useUpdateGlobals, useStartCallbacks } from '../..'
import { MiniDom } from '../../core';
import { prepCanvas } from './prepCanvas';
// import { LunchboxScene } from './LunchboxScene'
// TODO: event handlers
// import { LunchboxEventHandlers } from '../LunchboxEventHandlers'
// import * as Keys from '../../keys'
// import { waitFor } from '../../utils'

// Props
// ==================
const props = withDefaults(defineProps<Lunch.WrapperProps>(), {
    dpr: -1,
    sizePolicy: 'full',
})


// Refs, slots, etc
// ==================
const app = useApp();
const container = ref<MiniDom.RendererDomNode>();
const canvas = ref<MiniDom.RendererDomNode>();
const renderer = ref<Lunch.LunchboxComponent<THREE.WebGLRenderer>>();
const camera = ref<Lunch.LunchboxComponent<THREE.Camera>>();
const scene = ref<Lunch.LunchboxComponent<THREE.Scene>>();
const slots = useSlots();
const updateGlobals = useUpdateGlobals();

// Options
// ==================
const consolidatedCameraProperties: Record<string, any> = reactive({
    position: props.cameraPosition ?? [0, 0, 0],
    zoom: props.zoom,
})

// Container styling
// ==================
const containerFillStyle =
    props.sizePolicy === 'container' ? 'static' : 'absolute'
const canvasFillStyle =
    props.sizePolicy === 'container' ? 'static' : 'fixed'
const fillStyle = (position: CSSProperties['position']): StyleValue => {
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

// Mounted
// ==================
const startCallbacks = useStartCallbacks();
const hasOnMountedRun = ref(false);
onMounted(() => {
    // canvas needs to exist (or user needs to handle it on their own)
    if (!canvas.value?.domElement && !slots.renderer?.().length)
        throw new Error('missing canvas')

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
    updateGlobals?.({
        dpr: props.dpr === -1 ? window.devicePixelRatio : props.dpr,
    })

    // TODO: props.r3f, sugar, save app properties

    // Done initializing
    hasOnMountedRun.value = true
})

const getInstance = <T>(input?: Lunch.LunchboxComponent<T>) => {
    return input?.$el.instance;
}

// Start when ready
const hasStartRun = ref(false);
watch([scene, camera, renderer, hasOnMountedRun, container], newVals => {
    if (hasStartRun.value) return;

    const [newScene, newCamera, newRenderer] = newVals;
    const sceneInstance = getInstance(newScene);
    const cameraInstance = getInstance(newCamera);
    const rendererInstance = getInstance(newRenderer);

    if (!sceneInstance || !rendererInstance || !cameraInstance || !app || !hasOnMountedRun || !container.value) return;

    // Prep canvas
    prepCanvas(
        container,
        cameraInstance,
        rendererInstance,
        sceneInstance,
        props.sizePolicy,
    )

    // Start & update
    const updateParams = {
        app,
        camera: cameraInstance,
        renderer: rendererInstance,
        scene: sceneInstance,
        updateSource: props.updateSource,
    }

    for (let startCallback of startCallbacks ?? []) {
        startCallback(updateParams)
    }

    update(updateParams);


    // ensure this doesn't run again
    hasStartRun.value = true;
}, {
    immediate: true
})

// UNMOUNT
// ==================
// TODO

</script>


<!--
// /** fixed & fill styling for container */
// const fillStyle = (position: string) => {
//     return {
//         position,
//         top: 0,
//         right: 0,
//         bottom: 0,
//         left: 0,
//         width: '100%',
//         height: '100%',
//         display: 'block',
//     }
// }

// export const LunchboxWrapper = defineComponent({
//     name: 'Lunchbox',
//     props: {
//         // These should match the Lunchbox.WrapperProps interface
//         background: String,
//         cameraArgs: Array,
//         cameraLook: Array as unknown as PropType<Lunch.Vector3AsArray>,
//         cameraLookAt: Array as unknown as PropType<Lunch.Vector3AsArray>,
//         cameraPosition: Array as unknown as PropType<Lunch.Vector3AsArray>,
//         dpr: Number,
//         ortho: Boolean,
//         orthographic: Boolean,
//         r3f: Boolean,
//         rendererArguments: Object,
//         rendererProperties: Object,
//         sizePolicy: String as PropType<Lunch.SizePolicy>,
//         shadow: [Boolean, Object],
//         transparent: Boolean,
//         zoom: Number,
//         updateSource: Object as PropType<WatchSource>,
//     },
//     setup(props, context) {
//         const canvas = ref<MiniDom.RendererDomNode>()
//         let dpr = props.dpr ?? -1
//         const container = ref<MiniDom.RendererDomNode>()
//         const renderer = ref<Lunch.LunchboxComponent<THREE.Renderer>>()
//         const camera = ref<Lunch.LunchboxComponent<THREE.Camera>>()
//         const scene = ref<Lunch.LunchboxComponent<THREE.Scene>>()
//         const globals = useGlobals()
//         const updateGlobals = useUpdateGlobals()
//         const app = useApp()
//         const consolidatedCameraProperties: Record<string, any> = reactive({})
//         const startCallbacks = useStartCallbacks()

//         // https://threejs.org/docs/index.html#manual/en/introduction/Color-management
//         if (props.r3f && (THREE as any)?.ColorManagement) {
//             ;(THREE as any).ColorManagement.legacyMode = false
//         }

//         const interactables = useLunchboxInteractables()

//         // MOUNT
//         // ====================
//         onMounted(async () => {
//             // canvas needs to exist (or user needs to handle it on their own)
//             if (!canvas.value && !context.slots?.renderer?.()?.length)
//                 throw new Error('missing canvas')

//             // no camera provided, so let's create one
//             if (!context.slots?.camera?.()?.length) {
//                 if (props.cameraPosition) {
//                     consolidatedCameraProperties.position = props.cameraPosition
//                 }
//                 if (props.cameraLook || props.cameraLookAt) {
//                     consolidatedCameraProperties.lookAt =
//                         props.cameraLook || props.cameraLookAt
//                 }
//                 if (props.zoom !== undefined) {
//                     consolidatedCameraProperties.zoom = props.zoom
//                 }
//             }

//             // SCENE
//             // ====================
//             // set background color
//             if (scene.value?.$el?.instance && props.background) {
//                 scene.value.$el.instance.background = new THREE.Color(
//                     props.background
//                 )
//             }

//             // MISC PROPERTIES
//             // ====================
//             if (dpr === -1) {
//                 dpr = window.devicePixelRatio
//             }
//             updateGlobals?.({ dpr })

//             while (
//                 !renderer.value?.$el?.instance &&
//                 // TODO: remove `as any`
//                 !(renderer.value as any)?.component?.ctx.$el?.instance
//             ) {
//                 await new Promise((r) => requestAnimationFrame(r))
//             }

//             while (
//                 !scene.value?.$el?.instance &&
//                 // TODO: remove `as any`
//                 !(scene.value as any)?.component?.ctx.$el?.instance
//             ) {
//                 await new Promise((r) => requestAnimationFrame(r))
//             }

//             const normalizedRenderer = (renderer.value?.$el?.instance ??
//                 (renderer.value as any)?.component?.ctx.$el
//                     ?.instance) as THREE.WebGLRenderer

//             normalizedRenderer.setPixelRatio(globals.dpr)

//             const normalizedScene = (scene.value?.$el?.instance ??
//                 (scene.value as any)?.component?.ctx.$el
//                     ?.instance) as THREE.Scene

//             const normalizedCamera = (camera.value?.$el?.instance ??
//                 (camera.value as any)?.component?.ctx.$el
//                     ?.instance) as THREE.Camera

//             // TODO: update DPR on monitor switch
//             // prep canvas (sizing, observe, unmount, etc)
//             // (only run if no custom renderer)
//             if (!context.slots?.renderer?.()?.length) {
//                 // TODO: use dispose
//                 const { dispose } = prepCanvas(
//                     container,
//                     normalizedCamera,
//                     normalizedRenderer,
//                     normalizedScene,
//                     props.sizePolicy
//                 )

//                 if (props.r3f) {
//                     normalizedRenderer.outputEncoding = THREE.sRGBEncoding
//                     normalizedRenderer.toneMapping = THREE.ACESFilmicToneMapping
//                 }

//                 // update render sugar
//                 const sugar = {
//                     shadow: props.shadow,
//                 }
//                 if (sugar?.shadow) {
//                     normalizedRenderer.shadowMap.enabled = true
//                     if (typeof sugar.shadow === 'object') {
//                         normalizedRenderer.shadowMap.type = sugar.shadow.type
//                     }
//                 }
//             }

//             // START
//             // ====================
//             if (!app) {
//                 throw new Error('error creating app')
//             }

//             // save renderer, scene, camera
//             app.config.globalProperties.lunchbox.camera = normalizedCamera
//             app.config.globalProperties.lunchbox.renderer = normalizedRenderer
//             app.config.globalProperties.lunchbox.scene = normalizedScene

//             for (let startCallback of startCallbacks ?? []) {
//                 startCallback({
//                     app,
//                     camera: normalizedCamera,
//                     renderer: normalizedRenderer,
//                     scene: normalizedScene,
//                 })
//             }

//             // KICK UPDATE
//             // ====================
//             update({
//                 app,
//                 camera: normalizedCamera,
//                 renderer: normalizedRenderer,
//                 scene: normalizedScene,
//                 updateSource: props.updateSource,
//             })
//         })

//         // UNMOUNT
//         // ====================
//         onBeforeUnmount(() => {
//             cancelUpdate()
//             cancelUpdateSource()
//         })

//         // RENDER FUNCTION
//         // ====================
//         const containerFillStyle =
//             props.sizePolicy === 'container' ? 'static' : 'absolute'
//         const canvasFillStyle =
//             props.sizePolicy === 'container' ? 'static' : 'fixed'

//         // REACTIVE CUSTOM CAMERAS
//         // ====================
//         // find first camera with `type.name` property
//         // (which indicates a Lunch.Node)
//         const activeCamera = computed(() => {
//             const output = context.slots
//                 ?.camera?.()
//                 .find((c) => (c.type as any)?.name)
//             if (output) {
//                 return output
//             }

//             return output
//         })

//         // TODO: make custom cameras reactive
//         watch(
//             activeCamera,
//             async (newVal, oldVal) => {
//                 // console.log('got camera', newVal)
//                 if (newVal && newVal?.props?.key !== oldVal?.props?.key) {
//                     // TODO: remove cast
//                     camera.value = newVal as any

//                     // TODO: why isn't this updating app camera?
//                     // const el = await waitFor(() => newVal.el)
//                     // console.log(el)
//                     // camera.value = el
//                     // console.log(newVal.uuid)
//                     // updateGlobals?.({ camera: el })
//                 }
//             },
//             { immediate: true }
//         )

//         // RENDER FUNCTION
//         // ====================
//         return () => (
//             <>
//                 {/* use renderer slot if provided... */}
//                 {context.slots?.renderer?.()?.length ? (
//                     // TODO: remove `as any` cast
//                     (renderer.value = context.slots?.renderer?.()[0] as any)
//                 ) : (
//                     // ...otherwise, add canvas...
//                     <>
//                         <div
//                             class="lunchbox-container"
//                             style={fillStyle(containerFillStyle) as any}
//                             ref={container}
//                             data-lunchbox="true"
//                         >
//                             <canvas
//                                 ref={canvas}
//                                 class="lunchbox-canvas"
//                                 style={fillStyle(canvasFillStyle) as any}
//                                 data-lunchbox="true"
//                             ></canvas>
//                         </div>
//                         {/* ...and create default renderer once canvas is present */}
//                         {canvas.value?.domElement && (
//                             <webGLRenderer
//                                 {...(props.rendererProperties ?? {})}
//                                 ref={renderer}
//                                 args={[
//                                     {
//                                         alpha: props.transparent,
//                                         antialias: true,
//                                         canvas: canvas.value?.domElement,
//                                         powerPreference: !!props.r3f
//                                             ? 'high-performance'
//                                             : 'default',
//                                         ...(props.rendererArguments ?? {}),
//                                     },
//                                 ]}
//                             />
//                         )}
//                     </>
//                 )}

//                 {/* use scene slot if provided... */}
//                 {context.slots?.scene?.()?.length ? (
//                     // TODO: remove `as any` cast
//                     (scene.value = context.slots?.scene?.()[0] as any)
//                 ) : (
//                     // ...otherwise, add default scene
//                     // TODO: why does this need to be a separate component? <scene> throws an error
//                     <LunchboxScene ref={scene}>
//                         {context.slots?.default?.()}
//                     </LunchboxScene>
//                 )}

//                 {/* use camera slot if provided... */}
//                 {context.slots?.camera?.()?.length ? (
//                     // TODO: remove `any` cast
//                     camera.value
//                 ) : props.ortho || props.orthographic ? (
//                     <orthographicCamera
//                         ref={camera}
//                         args={props.cameraArgs ?? []}
//                         {...consolidatedCameraProperties}
//                     />
//                 ) : (
//                     <perspectiveCamera
//                         ref={camera}
//                         args={
//                             props.cameraArgs ?? [
//                                 props.r3f ? 75 : 45,
//                                 0.5625,
//                                 1,
//                                 1000,
//                             ]
//                         }
//                         {...consolidatedCameraProperties}
//                     />
//                 )}

//                 {/* Lunchbox interaction handlers */}
//                 {interactables?.value.length && <LunchboxEventHandlers />}
//             </>
//         )
//     },
// })
-->