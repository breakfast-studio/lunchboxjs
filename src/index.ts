import {
    ComputedRef,
    computed,
    createRenderer,
    Component,
    inject,
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
    // ensureRootNode,
    extend,
    inputActive,
    mousePos,
    rootUuid,
    MiniDom,
} from './core'
import { components } from './components'
import { Lunch } from './types'

// export { lunchboxRootNode as lunchboxTree } from './core'
export * from './core'
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
// TODO: update docs
export const camera = ensuredCamera
// TODO: update docs
export const useCamera = () => ensuredCamera()
/** Run a function using the current camera when it's present. */
// export function useCamera<T extends THREE.Camera = THREE.PerspectiveCamera>(
//     callback: (cam: T) => void
// ) {
//     return watch(
//         camera,
//         (newVal) => {
//             if (!newVal) return
//             callback(newVal as unknown as T)
//         },
//         { immediate: true }
//     )
// }

/** The current renderer as a computed value. Often easier to use `useRenderer` instead of this. */
export const renderer = ensureRenderer
/** Run a function using the current renderer when it's present. */
export const useRenderer = () => ensureRenderer()!

/** The current scene. Often easier to use `useScene` instead of this. */
// TODO: update docs
export const scene = ensuredScene
/** Run a function using the current scene when it's present. */
// TODO: update docs
export function useScene(callback: (newScene: THREE.Scene) => void) {
    return watch(
        scene,
        (newVal) => {
            if (!newVal) return
            callback(newVal.value)
        },
        { immediate: true }
    )
}

// let app: Lunch.App | null = null
// let queuedCustomRenderFunction:
//     | ((opts: Lunch.UpdateCallbackProperties) => void)
//     | null = null

// CUSTOM RENDER SUPPORT
// ====================
/** Set a custom render function, overriding the Lunchbox app's default render function.
 * Changing this requires the user to manually render their scene.
 *
 * Invokes immediately - use `useCustomRender().setCustomRender`
 * if you need to call somewhere outside of `setup`.
 */
export const setCustomRender = (
    render: (opts: Lunch.UpdateCallbackProperties) => void
) => {
    useCustomRender()?.setCustomRender?.(render)
}

/** Clear the active app's custom render function.
 *
 * Invokes immediately - use `useCustomRender().clearCustomRender`
 * if you need to call somewhere outside of `setup`.
 */
export const clearCustomRender = () => {
    useCustomRender()?.clearCustomRender?.()
}

/** Provides `setCustomRender` and `clearCustomRender` functions to be called in a non-`setup` context. */
export const useCustomRender = () => {
    return {
        /** Set a custom render function, overriding the Lunchbox app's default render function.
         * Changing this requires the user to manually render their scene. */
        setCustomRender: inject<Lunch.CustomRenderFunctionSetter>(
            Keys.setCustomRenderKey
        ),
        /** Clear the active app's custom render function. */
        clearCustomRender: inject<() => void>(Keys.clearCustomRenderKey),
    }
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
    inject<Lunch.AppGlobalsUpdate>(Keys.updateGlobalsInjectionKey)

/** Update app-level globals.
 *
 * Invokes immediately - use `useUpdateGlobals`
 * if you need to call somewhere outside of `setup`.
 */
export const updateGlobals = (newValue: Partial<Lunch.AppGlobals>) => {
    useUpdateGlobals()?.(newValue)
}

// TODO: document
export const useRootNode = () =>
    inject<MiniDom.RendererRootNode>(Keys.appRootNodeKey)

// TODO: document
export const useApp = () => inject<Lunch.App>(Keys.appKey)

// CREATE APP
// ====================
export const createApp = (root: Component) => {
    const app = createRenderer(nodeOps).createApp(root) as Lunch.App

    // provide app-level globals & globals update method
    // ====================
    // TODO: migrate to app.config.globalProperties.lunchbox
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

    // provide custom renderer functions
    // ====================
    app.provide(
        Keys.setCustomRenderKey,
        (render: (opts: Lunch.UpdateCallbackProperties) => void) => {
            app.setCustomRender(render)
        }
    )
    app.provide(Keys.clearCustomRenderKey, () => {
        app.clearCustomRender()
    })

    // before render
    // ====================
    const beforeRender = [] as Lunch.UpdateCallback[]
    app.provide(Keys.beforeRenderKey, beforeRender)
    app.provide(
        Keys.onBeforeRenderKey,
        (cb: Lunch.UpdateCallback, index = Infinity) => {
            if (index === Infinity) {
                beforeRender.push(cb)
            } else {
                beforeRender.splice(index, 0, cb)
            }
        }
    )
    app.provide(
        Keys.offBeforeRenderKey,
        (cb: Lunch.UpdateCallback | number) => {
            if (isFinite(cb as number)) {
                beforeRender.splice(cb as number, 1)
            } else {
                const idx = beforeRender.findIndex((v) => v == cb)
                if (idx !== -1) {
                    beforeRender.splice(idx, 1)
                }
            }
        }
    )

    // after render
    // ====================
    const afterRender = [] as Lunch.UpdateCallback[]
    app.provide(Keys.afterRenderKey, afterRender)
    app.provide(
        Keys.onAfterRenderKey,
        (cb: Lunch.UpdateCallback, index = Infinity) => {
            if (index === Infinity) {
                afterRender.push(cb)
            } else {
                afterRender.splice(index, 0, cb)
            }
        }
    )
    app.provide(Keys.offAfterRenderKey, (cb: Lunch.UpdateCallback | number) => {
        if (isFinite(cb as number)) {
            afterRender.splice(cb as number, 1)
        } else {
            const idx = afterRender.findIndex((v) => v == cb)
            if (idx !== -1) {
                afterRender.splice(idx, 1)
            }
        }
    })

    // save app-level components
    // ====================
    app.config.globalProperties.lunchbox = reactive({
        afterRender,
        beforeRender,
        camera: null,
        frameId: -1,
        renderer: null,
        scene: null,
        watchStopHandle: null,
    })

    // frame ID (used for update functions)
    // ====================
    app.provide(Keys.frameIdKey, app.config.globalProperties.lunchbox.frameId)

    // watch stop handler (used for conditional update loop)
    // ====================
    app.provide(
        Keys.watchStopHandleKey,
        app.config.globalProperties.lunchbox.watchStopHandle
    )

    // register all components
    // ====================
    Object.keys(components).forEach((key) => {
        app?.component(key, (components as any)[key])
    })

    // update mount function to match Lunchbox.Node
    // ====================
    const { mount } = app
    app.mount = (root, ...args) => {
        // find DOM element to use as app root
        const domElement = (
            typeof root === 'string' ? document.querySelector(root) : root
        ) as HTMLElement
        // create or find root node
        const rootNode = new MiniDom.RendererRootNode({
            domElement,
            isLunchboxRootNode: true,
            name: 'root',
            metaType: 'rootMeta',
            type: 'root',
            uuid: rootUuid,
        })
        app.rootNode = rootNode
        app.provide(Keys.appRootNodeKey, rootNode)
        const mounted = mount(rootNode, ...args)
        return mounted
    }

    // embed .extend function
    // ====================
    app.extend = (targets: Record<string, any>) => {
        extend({ app: app!, ...targets })
        return app!
    }

    // prep for custom render support
    // ====================
    app.setCustomRender = (
        newRender: (opts: Lunch.UpdateCallbackProperties) => void
    ) => {
        if (app) {
            app.customRender = newRender
        }
    }

    // // add queued custom render if we have one
    // if (queuedCustomRenderFunction) {
    //     app.setCustomRender(queuedCustomRenderFunction)
    //     queuedCustomRenderFunction = null
    // }

    // add custom render removal
    app.clearCustomRender = () => {
        if (app) {
            app.customRender = null
        }
    }

    // provide app
    // ====================
    app.provide(Keys.appKey, app)
    app.provide(
        Keys.appRenderersKey,
        computed(() => app.config.globalProperties.lunchbox.renderer)
    )
    app.provide(
        Keys.appSceneKey,
        computed(() => app.config.globalProperties.lunchbox.scene)
    )
    app.provide(
        Keys.appCameraKey,
        computed(() => app.config.globalProperties.lunchbox.camera)
    )

    // done
    return app
}
