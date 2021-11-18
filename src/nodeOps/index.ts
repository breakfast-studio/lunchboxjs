import { RendererOptions } from 'vue'
import { createElement } from './createElement'
import { insert } from './insert'
import { remove } from './remove'
import { isLunchboxDomComponent, isLunchboxRootNode } from '../utils'
import {
    createCommentNode,
    createTextNode,
    MiniDom,
    updateObjectProp,
} from '../core'
import { Lunch } from '..'

/*
    Elements are `create`d from the outside in, then `insert`ed from the inside out.
*/

export const nodeOps: RendererOptions<
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
        // console.log('found', result)
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
        updateObjectProp({ node: node as Lunch.Node, key, value: nextValue })
    },
    remove,
    setElementText() {
        // noop
    },
    setText() {
        // noop
    },
}
