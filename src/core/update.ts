import {
    //ensureRenderer,
    // ensuredScene,
    ensuredCamera,
} from '.'
import { Lunch } from '..'
import { inject, toRaw, watch, WatchStopHandle } from 'vue'
import * as Keys from '../keys'

// let frameID: number
// let watchStopHandle: WatchStopHandle

// export const beforeRender = [] as Lunch.UpdateCallback[]
// export const afterRender = [] as Lunch.UpdateCallback[]

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
                camera: ensuredCamera.value?.instance,
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

// export const onAfterRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
//     if (index === Infinity) {
//         afterRender.push(cb)
//     } else {
//         afterRender.splice(index, 0, cb)
//     }
// }

// export const offAfterRender = (cb: Lunch.UpdateCallback | number) => {
//     if (isFinite(cb as number)) {
//         afterRender.splice(cb as number, 1)
//     } else {
//         const idx = afterRender.findIndex((v) => v == cb)
//         afterRender.splice(idx, 1)
//     }
// }

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
