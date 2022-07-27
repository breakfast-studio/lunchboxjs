import {
    computed,
    createRenderer,
    Component,
    inject,
    ref,
    watch,
    reactive,
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

import * as Keys from './keys'
export * from './keys'

// Utilities
export * from './utils/find'

/** Useful globals. */
export const globals = {
    // dpr: ref(1),
    inputActive,
    mousePos,
}

/** The current camera. Often easier to use `useCamera` instead of this. */
export const camera = computed(() => ensuredCamera.value?.instance ?? null)
/** Run a function using the current camera when it's present. */
export function useCamera<T extends THREE.Camera = THREE.PerspectiveCamera>(
    callback: (cam: T) => void
) {
    return watch(
        camera,
        (newVal) => {
            if (!newVal) return
            callback(newVal as unknown as T)
        },
        { immediate: true }
    )
}

/** The current renderer. Often easier to use `useRenderer` instead of this. */
export const renderer = computed(() => ensureRenderer.value?.instance ?? null)
/** Run a function using the current renderer when it's present. */
export function useRenderer<T extends THREE.Renderer = THREE.WebGLRenderer>(
    callback: (rend: T) => void
) {
    return watch(
        renderer,
        (newVal) => {
            if (!newVal) return
            callback(newVal as unknown as T)
        },
        { immediate: true }
    )
}

/** The current scene. Often easier to use `useScene` instead of this. */
export const scene = computed(() => ensuredScene.value.instance)
/** Run a function using the current scene when it's present. */
export function useScene(callback: (newScene: THREE.Scene) => void) {
    return watch(
        scene,
        (newVal) => {
            if (!newVal) return
            callback(newVal as any)
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

/** Use app-level globals. */
export const useGlobals = () =>
    inject<Lunch.AppGlobals>(Keys.globalsInjectionKey)!

/** Construct a function to update your app-level globals.
 *
 * ```js
 * // in setup():
 * const updateGlobals = useUpdateGlobals()
 *
 * // ...later, to update the device pixel resolution...
 * updateGlobals({ dpr: 2 })
 * ```
 */
export const useUpdateGlobals = () =>
    inject<Lunch.AppGlobalsUpdate>(Keys.updateGlobalsInjectionKey)!

// CREATE APP
// ====================
export const createApp = (root: Component) => {
    app = createRenderer(nodeOps).createApp(root) as Lunch.App

    // provide app-level globals & update method
    const globals: Lunch.AppGlobals = reactive({
        dpr: 1,
        // TODO:
        // inputActive:
        // mousePos:
    })
    app.provide(Keys.globalsInjectionKey, globals)
    app.provide<Lunch.AppGlobalsUpdate>(
        Keys.updateGlobalsInjectionKey,
        (newGlobals: Partial<Lunch.AppGlobals>) => {
            Object.keys(newGlobals).forEach((key) => {
                const typedKey = key as keyof typeof globals
                globals[typedKey] = newGlobals[typedKey]!
            })
        }
    )

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
        if (app) {
            app.customRender = newRender
        }
    }

    // add queued custom render if we have one
    if (queuedCustomRenderFunction) {
        app.setCustomRender(queuedCustomRenderFunction)
        queuedCustomRenderFunction = null
    }

    // add custom render removal
    app.clearCustomRender = () => {
        if (app) {
            app.customRender = null
        }
    }

    // done
    return app
}
