import {
    computed,
    createRenderer,
    Component,
    ref,
    watch,
    WatchStopHandle,
} from 'vue'
import { nodeOps } from './nodeOps'
import {
    // createdCamera,
    // createdRenderer,
    // autoScene,
    ensuredCamera,
    ensureRenderer,
    ensuredScene,
    ensureRootNode,
    extend,
    inputActive,
    mousePos,
    rootUuid,
} from './core'
import { components } from './components'
import { Lunch } from './types'

export { lunchboxRootNode as lunchboxTree } from './core'
export {
    offAfterRender,
    offBeforeRender,
    onAfterRender,
    onBeforeRender,
    onStart,
} from './core'
export * from './types'

// Utilities
export * from './utils/find'

/** Useful globals. */
export const globals = {
    dpr: ref(1),
    inputActive,
    mousePos,
}

/** The current camera. Often easier to use `useCamera` instead of this. */
export const camera = computed(() => ensuredCamera.value?.instance ?? null)
/** Run a function using the current camera when it's present. */
export function useCamera<T extends THREE.Camera = THREE.PerspectiveCamera>(
    callback: (cam: T) => void,
    once = true
) {
    let destroy: WatchStopHandle
    destroy = watch(
        camera,
        (newVal) => {
            if (!newVal) return

            // TODO: better fix than `any`?
            callback(newVal as any)
            if (once) {
                destroy?.()
            }
        },
        { immediate: true }
    )
}

/** The current renderer. Often easier to use `useRenderer` instead of this. */
export const renderer = computed(() => ensureRenderer.value?.instance ?? null)
/** Run a function using the current renderer when it's present. */
export function useRenderer<T extends THREE.Renderer = THREE.WebGLRenderer>(
    callback: (rend: T) => void,
    once = true
) {
    let destroy: WatchStopHandle
    destroy = watch(
        renderer,
        (newVal) => {
            if (!newVal) return

            // TODO: better fix than `any`?
            callback(newVal as any)
            if (once) {
                destroy?.()
            }
        },
        { immediate: true }
    )
}

/** The current scene. Often easier to use `useScene` instead of this. */
export const scene = computed(() => ensuredScene.value.instance)
/** Run a function using the current scene when it's present. */
export function useScene(
    callback: (newScene: THREE.Scene) => void,
    once = true
) {
    let destroy: WatchStopHandle
    destroy = watch(
        scene,
        (newVal) => {
            if (!newVal) return

            // TODO: better fix than `any`?
            callback(newVal as any)
            if (once) {
                destroy?.()
            }
        },
        { immediate: true }
    )
}

// CUSTOM RENDER SUPPORT
// ====================
let app: Lunch.App | null = null
let queuedCustomRenderFunction:
    | ((opts: Lunch.UpdateCallbackProperties) => void)
    | null = null

/** Set a custom render function, overriding the Lunchbox app's default render function.
 * Changing this requires the user to manually render their scene.
 */
export const setCustomRender = (
    render: (opts: Lunch.UpdateCallbackProperties) => void
) => {
    if (app) app.setCustomRender(render)
    else queuedCustomRenderFunction = render
}

/** Clear the active app's custom render function. */
export const clearCustomRender = () => {
    if (app) app.clearCustomRender()
    else queuedCustomRenderFunction = null
}

// CREATE APP
// ====================
export const createApp = (root: Component) => {
    app = createRenderer(nodeOps).createApp(root) as Lunch.App

    // register all components
    Object.keys(components).forEach((key) => {
        app?.component(key, (components as any)[key])
    })

    // update mount function to match Lunchbox.Node
    const { mount } = app
    app.mount = (root, ...args) => {
        // find DOM element to use as app root
        const domElement = (
            typeof root === 'string' ? document.querySelector(root) : root
        ) as HTMLElement
        // create or find root node
        const rootNode = ensureRootNode({
            domElement,
            isLunchboxRootNode: true,
            name: 'root',
            metaType: 'rootMeta',
            type: 'root',
            uuid: rootUuid,
        })
        app!.rootNode = rootNode
        const mounted = mount(rootNode, ...args)
        return mounted
    }

    // embed .extend function
    app.extend = (targets: Record<string, any>) => {
        extend({ app: app!, ...targets })
        return app!
    }

    // prep for custom render support
    app.setCustomRender = (
        newRender: (opts: Lunch.UpdateCallbackProperties) => void
    ) => {
        app!.customRender = newRender
    }

    // add queued custom render if we have one
    if (queuedCustomRenderFunction) {
        app.setCustomRender(queuedCustomRenderFunction)
        queuedCustomRenderFunction = null
    }

    // add custom render removal
    app.clearCustomRender = () => {
        app!.customRender = null
    }

    // done
    return app
}
