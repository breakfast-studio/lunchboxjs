import { computed, createRenderer, Component, ref, watch } from 'vue'
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
export { onBeforeRender, onAfterRender } from './core'
export * from './types'

// Utilities
export * from './utils/find'

/** Useful globals. */
export const globals = {
    dpr: ref(1),
    inputActive,
    mousePos,
}

export const camera = computed(() => ensuredCamera.value?.instance ?? null)
export const renderer = computed(() => ensureRenderer.value?.instance ?? null)
export const scene = computed(() => ensuredScene.value.instance)

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
        app!.component(key, (components as any)[key])
    })

    // update mount function to match Lunchbox.Node
    const { mount } = app
    app.mount = (root, ...args) => {
        const domElement = (
            typeof root === 'string' ? document.querySelector(root) : root
        ) as HTMLElement
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
