import {
    // allNodes,
    MiniDom,
} from '../core'
import { isLunchboxStandardNode } from '../utils'
// import { overrides } from '../core'

export const remove = (node: MiniDom.RendererBaseNode) => {
    if (!node) return
    // const overrideKeys = Object.keys(overrides)
    // prep subtree
    const subtree: MiniDom.BaseNode[] = []
    node.walk((descendant) => {
        subtree.push(descendant)
        return true
    })

    // clean up subtree
    subtree.forEach((n) => {
        // const overrideKey = overrideKeys.find(
        //     (key) => overrides[key]?.uuid === n.uuid
        // )
        // // if this node is an override, remove it from the overrides list
        // if (overrideKey) {
        //     overrides[overrideKey] = null
        // }

        if (isLunchboxStandardNode(n)) {
            // try to remove three object
            n.instance?.removeFromParent?.()

            // try to dispose three object
            const dispose =
                // calling `dispose` on a scene triggers an error,
                // so let's ignore if this node is a scene
                n.type !== 'scene' &&
                ((n.instance as any)?.dispose as (() => void) | null)
            if (dispose) dispose.bind(n.instance)()
            n.instance = null
        }

        // drop tree node
        n.drop()

        // remove Lunchbox node from main list
        // const idx = allNodes.findIndex((v) => v.uuid === n.uuid)
        // if (idx !== -1) {
        //     allNodes.splice(idx, 1)
        // }
    })
}
