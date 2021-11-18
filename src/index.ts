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
    update,
} from './core'
import { components } from './components'
import { Lunch } from './types'

export { lunchboxRootNode as lunchboxTree } from './core'
export { onBeforeRender, onAfterRender, update } from './core'
export * from './types'

// Utilities
export * from './utils/find'

/** Useful globals. */
export const globals = {
    dpr: ref(1),
    inputActive,
    mousePos,
}

export const camera = computed(() => ensuredCamera.value.instance)
export const renderer = computed(() => ensureRenderer.value?.instance ?? null)
export const scene = computed(() => ensuredScene.value.instance)

export const createApp = (root: Component) => {
    const app = createRenderer(nodeOps).createApp(root) as Lunch.App

    // register all components
    Object.keys(components).forEach((key) => {
        app.component(key, (components as any)[key])
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
        app.rootNode = rootNode
        const mounted = mount(rootNode, ...args)
        return mounted
    }

    // embed .extend function
    app.extend = (targets: Record<string, any>) => {
        extend({ app, ...targets })
        return app
    }

    // done
    return app
}
