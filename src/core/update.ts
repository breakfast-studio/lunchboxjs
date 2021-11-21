import { ensureRenderer, ensuredScene, ensuredCamera } from '.'
import { Lunch } from '..'
import { toRaw } from 'vue'

let frameID: number

export const beforeRender = [] as Lunch.UpdateCallback[]
export const afterRender = [] as Lunch.UpdateCallback[]

export const update: Lunch.UpdateCallback = (opts) => {
    // request next frame
    frameID = requestAnimationFrame(() =>
        update({
            app: opts.app,
            renderer: ensureRenderer.value?.instance,
            scene: ensuredScene.value.instance,
            camera: ensuredCamera.value.instance,
        })
    )

    // prep options
    const { app, renderer, scene, camera } = opts

    // BEFORE RENDER
    beforeRender.forEach((cb: Lunch.UpdateCallback | undefined) => {
        if (cb) {
            cb(opts)
        }
    })

    // RENDER
    if (renderer && scene && camera) {
        if (app.customRender) {
            app.customRender(opts)
        } else {
            renderer.render(toRaw(scene), toRaw(camera))
        }
    }

    // AFTER RENDER
    afterRender.forEach((cb: Lunch.UpdateCallback | undefined) => {
        if (cb) {
            cb(opts)
        }
    })
}

export const onBeforeRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    if (index === Infinity) {
        beforeRender.push(cb)
    } else {
        beforeRender.splice(index, 0, cb)
    }
}

export const onAfterRender = (cb: Lunch.UpdateCallback, index = Infinity) => {
    if (index === Infinity) {
        afterRender.push(cb)
    } else {
        afterRender.splice(index, 0, cb)
    }
}

export const cancelUpdate = () => {
    if (frameID) cancelAnimationFrame(frameID)
}
