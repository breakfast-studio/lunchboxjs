import { RendererOptions, ref } from 'vue'
import { createElement } from './createElement'
import { insert } from './insert'
import { remove } from './remove'
import { isLunchboxDomComponent, isLunchboxRootNode } from '../utils'
import { createCommentNode, createTextNode, updateObjectProp } from '../core'
import type { MiniDom } from '../core'
import type { Lunch } from '..'

/*
    Elements are `create`d from the outside in, then `insert`ed from the inside out.
*/

export const createNodeOps = () => {
    // APP-LEVEL GLOBALS
    // ====================
    // These need to exist at the app level in a place where the node ops can access them.
    // It'd be better to set these via `app.provide` at app creation, but the node ops need access
    // to these values before the app is instantiated, so this is the next-best place for them to exist.
    const interactables = ref([] as Lunch.Node[])

    // NODE OPS
    // ====================
    const nodeOps: RendererOptions<
        MiniDom.RendererBaseNode,
        MiniDom.RendererBaseNode
    > = {
        createElement,
        createText(text) {
            return createTextNode({ text })
        },
        createComment(text) {
            return createCommentNode({ text })
        },
        insert,
        nextSibling(node) {
            const result = node.nextSibling
            if (!result) return null
            return result as MiniDom.RendererBaseNode
        },
        parentNode(node) {
            const result = node.parentNode
            if (!result) return null
            return result as MiniDom.RendererBaseNode
        },
        patchProp(node, key, prevValue, nextValue) {
            if (isLunchboxDomComponent(node)) {
                // handle DOM node
                if (key === 'style') {
                    // special handling for style
                    Object.keys(nextValue).forEach((k) => {
                        ;(node.domElement.style as any)[k] = nextValue[k]
                    })
                } else {
                    node.domElement.setAttribute(key, nextValue)
                }
                return
            }

            // ignore if root node, or Lunchbox internal prop
            if (isLunchboxRootNode(node) || key.startsWith('$')) {
                return
            }

            // otherwise, update prop
            updateObjectProp({
                node: node as Lunch.Node,
                key,
                interactables,
                value: nextValue,
            })
        },
        remove,
        setElementText() {
            // noop
        },
        setText() {
            // noop
        },
    }

    return { nodeOps, interactables }
}
