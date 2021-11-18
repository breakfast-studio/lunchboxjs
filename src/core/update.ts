import { ensureRenderer, ensureScene, ensureCamera } from '.'
import { Lunch } from '..'

let frameID: number

export const beforeRender = [] as Lunch.UpdateCallback[]
export const afterRender = [] as Lunch.UpdateCallback[]

export const update: Lunch.UpdateCallback = (opts: {
    app: Lunch.App
    renderer?: THREE.Renderer | null
    scene?: THREE.Scene | null
    camera?: THREE.Camera | null
}) => {
    frameID = requestAnimationFrame(() => update(opts))

    const { app, renderer, scene, camera } = opts

    // BEFORE RENDER
    beforeRender.forEach((cb: Lunch.UpdateCallback | undefined) => {
        if (cb) {
            cb(opts)
        }
    })

    // RENDER
    if (renderer && scene && camera) {
        renderer.render(scene, camera)
    }

    // AFTER RENDER
    afterRender.forEach((cb: Lunch.UpdateCallback | undefined) => {
        if (cb) {
            cb(opts)
        }
    })

    /*
    frameID = requestAnimationFrame(() => update(renderer, scene, camera))

    // Make sure we have all necessary components
    if (!renderer) {
        renderer = ensureRenderer().instance
    }
    if (!scene) {
        scene = ensureScene().instance
    }
    if (!camera) {
        camera = ensureCamera().instance
    }


    */
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
