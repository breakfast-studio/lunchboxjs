import type { Lunch } from '..'
import { inject, toRaw, watch } from 'vue'
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
                toRaw(scene),
                // opts.app.config.globalProperties.lunchbox.camera!
                toRaw(camera)
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
// TODO: document
export const useBeforeRender = () => {
    return {
        onBeforeRender: inject<typeof onBeforeRender>(Keys.onBeforeRenderKey),
        offBeforeRender: inject<typeof offBeforeRender>(
            Keys.offBeforeRenderKey
        ),
    }
}

// TODO: document
export const onBeforeRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    useBeforeRender().onBeforeRender?.(cb, index)
}

// TODO: document
export const offBeforeRender = (cb: Lunch.UpdateCallback | number) => {
    useBeforeRender().offBeforeRender?.(cb)
}

// after render
// ====================
// TODO: document
export const useAfterRender = () => {
    return {
        onAfterRender: inject<typeof onAfterRender>(Keys.onBeforeRenderKey),
        offAfterRender: inject<typeof offAfterRender>(Keys.offBeforeRenderKey),
    }
}

// TODO: document
export const onAfterRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    useBeforeRender().onBeforeRender?.(cb, index)
}

// TODO: document
export const offAfterRender = (cb: Lunch.UpdateCallback | number) => {
    useBeforeRender().offBeforeRender?.(cb)
}

// TODO: document
export const useCancelUpdate = () => {
    const frameId = inject<number>(Keys.frameIdKey)
    return () => {
        if (frameId !== undefined) cancelAnimationFrame(frameId)
    }
}

// TODO: document
export const cancelUpdate = () => {
    useCancelUpdate()?.()
}

// TODO: document
export const useCancelUpdateSource = () => {
    const cancel = inject<
        Lunch.App['config']['globalProperties']['watchStopHandle']
    >(Keys.watchStopHandleKey)
    return () => cancel?.()
}

// TODO: document
export const cancelUpdateSource = () => {
    useCancelUpdateSource()?.()
}
