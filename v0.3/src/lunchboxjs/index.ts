import {
    computed,
    createRenderer,
    Component,
    ComputedRef,
    inject,
    watch,
    reactive,
    Ref,
    WatchStopHandle,
    toRaw,
} from 'vue'
import { createNodeOps } from './nodeOps'
import { extend, MiniDom } from './core'
import { components } from './components'
import { Lunch } from './types'
import * as THREE from 'three'

export * from './core'
export * from './types'

import * as Keys from './keys'
export * from './keys'

// Utilities
export * from './utils/find'

/** The current camera as a computed value. */
export const useCamera = <T extends THREE.Camera = THREE.Camera>() =>
    inject<ComputedRef<T>>(Keys.appCameraKey)!
/** Run a function using the current camera when it's present. */
export const onCameraReady = <T extends THREE.Camera = THREE.Camera>(
    cb: (camera?: T) => void
) => {
    const existing = useCamera<T>()
    if (existing.value) {
        cb(existing.value)
        return
    }

    let stopWatch: WatchStopHandle | null = null
    stopWatch = watch(useCamera<T>(), (newVal) => {
        if (newVal) {
            cb(newVal)
            stopWatch?.()
        }
    })
}

/** The current renderer as a computed value. */
export const useRenderer = <T extends THREE.Renderer = THREE.WebGLRenderer>() =>
    inject<ComputedRef<T>>(Keys.appRenderersKey)!
/** Run a function using the current renderer when it's present. */
export const onRendererReady = <T extends THREE.Renderer = THREE.Renderer>(
    cb: (renderer?: T) => void
) => {
    const existing = useRenderer<T>()
    if (existing.value) {
        cb(existing.value)
        return
    }

    let stopWatch: WatchStopHandle | null = null
    stopWatch = watch(
        useRenderer<T>(),
        (newVal) => {
            if (newVal) {
                cb(newVal)
                stopWatch?.()
            }
        },
        { immediate: true }
    )
}

/** The current scene as a computed value. */
export const useScene = <T extends THREE.Scene = THREE.Scene>() =>
    inject<ComputedRef<T>>(Keys.appSceneKey)!
/** Run a function using the current scene when it's present. */
export const onSceneReady = <T extends THREE.Scene = THREE.Scene>(
    cb: (scene?: T) => void
) => {
    const existing = useScene<T>()
    if (existing.value) {
        cb(existing.value)
        return
    }

    let stopWatch: WatchStopHandle | null = null
    stopWatch = watch(
        useScene<T>(),
        (newVal) => {
            if (newVal) {
                cb(newVal)
                stopWatch?.()
            }
        },
        { immediate: true }
    )
}

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

/** Use the current Lunchbox app. Usually used internally by Lunchbox. */
export const useApp = () => inject<Lunch.App>(Keys.appKey)!

/** Obtain a list of the start callback functions. Usually used internally by Lunchbox. */
export const useStartCallbacks = () =>
    inject<Lunch.UpdateCallback[]>(Keys.startCallbackKey)

/** Run a given callback once when the Lunchbox app starts. Include an index to
 * splice the callback at that index in the callback queue. */
export const onStart = (cb: Lunch.UpdateCallback, index = Infinity) => {
    const callbacks = useStartCallbacks()
    if (index === Infinity) {
        callbacks?.push(cb)
    } else {
        callbacks?.splice(index, 0, cb)
    }
}

/** Obtain a list of interactable objects (registered via onClick, onHover, etc events). Usually used internally by Lunchbox. */
export const useLunchboxInteractables = () =>
    inject<Ref<Lunch.Node[]>>(Keys.lunchboxInteractables)

/** Build a computed instance-getter from a specified ref. Defaults to a `toRaw`'d result. */
export const getInstance = <T = unknown>(
    target: Ref<Lunch.LunchboxComponent<T> | Lunch.Node<T> | null>,
    raw = true
) =>
    computed(() => {
        const output =
            (target.value as Lunch.LunchboxComponent<T>)?.$el?.instance ??
            (target.value as Lunch.Node<T>)?.instance ??
            null
        if (output && raw) return toRaw(output)
        return output
    })

// CREATE APP
// ====================
export const createApp = (
    root: Component,
    rootProps: Record<string, any> = {}
) => {
    const { nodeOps, interactables } = createNodeOps()
    const app = createRenderer(nodeOps).createApp(root, rootProps) as Lunch.App

    // provide Lunchbox interaction handlers flag (modified when user references events via
    // @click, etc)
    app.provide(Keys.lunchboxInteractables, interactables)

    // register all components
    // ====================
    Object.keys(components).forEach((key) => {
        app?.component(key, (components as any)[key])
    })

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
        dpr: 1,
        frameId: -1,
        renderer: null,
        scene: null,
        watchStopHandle: null,

        // TODO: inputActive, mousePos
    })

    // provide app-level globals & globals update method
    // ====================
    app.provide(Keys.globalsInjectionKey, app.config.globalProperties.lunchbox)
    app.provide<Lunch.AppGlobalsUpdate>(
        Keys.updateGlobalsInjectionKey,
        (newGlobals: Partial<Lunch.AppGlobals>) => {
            Object.keys(newGlobals).forEach((key) => {
                const typedKey = key as keyof Lunch.AppGlobals
                // TODO: fix
                app.config.globalProperties.lunchbox[typedKey] = newGlobals[
                    typedKey
                ] as any
            })
        }
    )

    // frame ID (used for update functions)
    // ====================
    app.provide(Keys.frameIdKey, app.config.globalProperties.lunchbox.frameId)

    // watch stop handler (used for conditional update loop)
    // ====================
    app.provide(
        Keys.watchStopHandleKey,
        app.config.globalProperties.lunchbox.watchStopHandle
    )

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
            uuid: 'LUNCHBOX_ROOT',
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

    // start callback functions
    // ====================
    const startCallbacks: Lunch.UpdateCallback[] = []
    app.provide(Keys.startCallbackKey, startCallbacks)

    // prep for custom render support
    // ====================
    app.setCustomRender = (
        newRender: (opts: Lunch.UpdateCallbackProperties) => void
    ) => {
        if (app) {
            app.customRender = newRender
        }
    }

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

    app._props

    // done
    return app
}

/** Use this plugin to add a <lunchbox> component in your HTML app. */
// export { bridge as lunchbox } from './plugins/bridge/bridge'
