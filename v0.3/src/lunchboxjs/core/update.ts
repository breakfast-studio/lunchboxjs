import type { Lunch } from '..'
import { inject, watch } from 'vue'
import * as Keys from '../keys'

const requestUpdate = (opts: Lunch.UpdateCallbackProperties) => {
    if (typeof opts.app.config.globalProperties.lunchbox.frameId === 'number') {
        cancelAnimationFrame(opts.app.config.globalProperties.lunchbox.frameId)
    }
    opts.app.config.globalProperties.lunchbox.frameId = requestAnimationFrame(
        () =>
            update({
                app: opts.app,
                renderer: opts.renderer,
                scene: opts.scene,
                camera: opts.camera,
                updateSource: opts.updateSource,
            })
    )
}

export const update: Lunch.UpdateCallback = (opts) => {
    if (opts.updateSource) {
        if (!opts.app.config.globalProperties.lunchbox.watchStopHandle) {
            // request next frame only when state changes
            opts.app.config.globalProperties.lunchbox.watchStopHandle = watch(
                opts.updateSource,
                () => {
                    requestUpdate(opts)
                },
                {
                    deep: true,
                }
            )
        }
    } else {
        // request next frame on a continuous loop
        requestUpdate(opts)
    }

    // prep options
    const { app, renderer, scene, camera } = opts

    // BEFORE RENDER
    app.config.globalProperties.lunchbox.beforeRender.forEach((cb) => {
        cb?.(opts)
    })

    // RENDER
    if (renderer && scene && camera) {
        if (app.customRender) {
            app.customRender(opts)
        } else {
            renderer.render(
                scene,
                camera,
                // toRaw(camera)
            )
        }
    }

    // AFTER RENDER
    app.config.globalProperties.lunchbox.afterRender.forEach((cb) => {
        cb?.(opts)
    })
}

// before render
// ====================
/** Obtain callback methods for `onBeforeRender` and `offBeforeRender`. Usually used internally by Lunchbox. */
export const useBeforeRender = () => {
    return {
        onBeforeRender: inject<typeof onBeforeRender>(Keys.onBeforeRenderKey),
        offBeforeRender: inject<typeof offBeforeRender>(
            Keys.offBeforeRenderKey
        ),
    }
}

/** Run a function before every render.
 *
 * Note that if `updateSource` is set in the Lunchbox wrapper component, this will **only** run
 * before a render triggered by that `updateSource`. Normally, the function should run every frame.
 */
export const onBeforeRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    useBeforeRender().onBeforeRender?.(cb, index)
}

/** Remove a function from the `beforeRender` callback list. Useful for tearing down functions added
 * by `onBeforeRender`.
 */
export const offBeforeRender = (cb: Lunch.UpdateCallback | number) => {
    useBeforeRender().offBeforeRender?.(cb)
}

// after render
// ====================
/** Obtain callback methods for `onAfterRender` and `offAfterRender`. Usually used internally by Lunchbox. */
export const useAfterRender = () => {
    return {
        onAfterRender: inject<typeof onAfterRender>(Keys.onBeforeRenderKey),
        offAfterRender: inject<typeof offAfterRender>(Keys.offBeforeRenderKey),
    }
}

/** Run a function after every render.
 *
 * Note that if `updateSource` is set in the Lunchbox wrapper component, this will **only** run
 * after a render triggered by that `updateSource`. Normally, the function should run every frame.
 */
export const onAfterRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    useBeforeRender().onBeforeRender?.(cb, index)
}

/** Remove a function from the `afterRender` callback list. Useful for tearing down functions added
 * by `onAfterRender`.
 */
export const offAfterRender = (cb: Lunch.UpdateCallback | number) => {
    useBeforeRender().offBeforeRender?.(cb)
}

/** Obtain a function used to cancel the current update frame. Use `cancelUpdate` if you wish
 * to immediately invoke the cancellation function. Usually used internally by Lunchbox.
 */
export const useCancelUpdate = () => {
    const frameId = inject<number>(Keys.frameIdKey)
    return () => {
        if (frameId !== undefined) cancelAnimationFrame(frameId)
    }
}

/** Cancel the current update frame. Usually used internally by Lunchbox. */
export const cancelUpdate = () => {
    useCancelUpdate()?.()
}

/** Obtain a function used to cancel an update source. Use `cancelUpdateSource` if you wish to
 * immediately invoke the cancellation function. Usually used internally by Lunchbox.
 */
export const useCancelUpdateSource = () => {
    const cancel = inject<
        Lunch.App['config']['globalProperties']['watchStopHandle']
    >(Keys.watchStopHandleKey)
    return () => cancel?.()
}

/** Cancel an update source. Usually used internally by Lunchbox. */
export const cancelUpdateSource = () => {
    useCancelUpdateSource()?.()
}
