import { allNodes, MiniDom } from '../core'
import { isLunchboxStandardNode } from "../utils"

export const remove = (node: MiniDom.RendererBaseNode) => {
    if (!node) return

    // prep subtree
    const subtree: MiniDom.BaseNode[] = []
    node.walk(descendant => {
        subtree.push(descendant)
        return true
    })

    // clean up subtree
    subtree.forEach((n) => {
        if (isLunchboxStandardNode(n)) {
            // try to remove three object
            n.instance?.removeFromParent?.()

            // try to dispose three object
            const dispose = (n.instance as any)?.dispose as (() => void) | null
            if (dispose) dispose.bind(n.instance)()
            n.instance = null
        }

        // drop tree node
        n.drop()

        // remove Lunchbox node from main list
        const idx = allNodes.findIndex(v => v.uuid === n.uuid)
        if (idx !== -1) {
            allNodes.splice(idx, 1)
        }
    })
}