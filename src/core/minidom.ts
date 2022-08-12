import { v4 as createUuid } from 'uuid'
// import { allNodes } from '.'
import { Lunch } from '..'

// MiniDom recreates DOM node properties and methods.
// Since Vue 3 is a DOM-first framework, many of its nodeOps depend on
// properties and methods the DOM naturally contains. MiniDom recreates
// those properties (as well as a few from the tree-model npm package)
// to make a DOM-like but otherwise agnostic hierarchy structure.
export namespace MiniDom {
    export class BaseNode {
        constructor(
            options: Partial<BaseNode> = {},
            parent?: MiniDom.BaseNode
        ) {
            this.parentNode = options?.parentNode ?? parent ?? null
            this.minidomType = 'MinidomBaseNode'
            this.uuid = options?.uuid ?? createUuid()

            // allNodes.push(this)
        }
        uuid: Lunch.Uuid

        // DOM FEATURES
        // ====================
        parentNode: MiniDom.BaseNode | null

        get nextSibling(): MiniDom.BaseNode | null {
            if (!this.parentNode) return null

            const idx = this.parentNode.children.findIndex(
                (n) => n.uuid === this.uuid
            )
            // return next sibling if we're present and not the last child of the parent
            if (idx !== -1 && idx < this.parentNode.children.length - 1) {
                return this.parentNode.children[idx + 1]
            }

            return null
        }

        insertBefore(
            child: MiniDom.BaseNode,
            anchor?: MiniDom.BaseNode | null
        ) {
            child.removeAsChildFromAnyParents()
            child.parentNode = this
            const anchorIdx = this.children.findIndex(
                (n) => n.uuid === anchor?.uuid
            )
            if (anchorIdx !== -1) {
                this.children.splice(anchorIdx, 0, child)
            } else {
                this.children.push(child)
            }
        }
        removeChild(child: MiniDom.BaseNode) {
            const idx = this.children.findIndex((n) => n?.uuid === child?.uuid)
            if (idx !== -1) {
                this.children.splice(idx, 1)
            }
        }

        // TREE FEATURES
        // ====================
        children = [] as MiniDom.BaseNode[]
        addChild(child: MiniDom.BaseNode) {
            if (child) {
                // remove child from any other parents
                child.removeAsChildFromAnyParents()

                // add to this node
                child.parentNode = this
                this.insertBefore(child, null)
            }
            return this
        }
        /** Get the array of Nodes representing the path from the root to this Node (inclusive). */
        getPath() {
            const output = [] as BaseNode[]
            let current = this as BaseNode | null
            while (current) {
                output.unshift(current)
                current = current.parentNode
            }
            return output
        }

        /** Drop this node. Removes parent's knowledge of this node
         * and resets this node's internal parent. */
        drop() {
            // remove as child
            this.removeAsChildFromAnyParents()
            // remove parent
            this.parentNode = null
        }

        /** Walk over the entire subtree. Return falsey value in callback to end early. */
        // TODO: depth-first vs breadth-first
        walk(callback: (item: MiniDom.BaseNode) => boolean) {
            const queue = [this, ...this.children] as MiniDom.BaseNode[]
            const traversed: MiniDom.BaseNode[] = []
            let canContinue = true
            while (queue.length && canContinue) {
                const current = queue.shift()
                if (current) {
                    if (traversed.includes(current)) continue

                    traversed.push(current)
                    queue.push(
                        ...current.children.filter(
                            (child) => !traversed.includes(child)
                        )
                    )
                    canContinue = callback(current)
                } else {
                    canContinue = false
                }
            }
        }

        // INTERNAL FEATURES
        // ====================
        minidomType: MiniDom.NodeType

        removeAsChildFromAnyParents() {
            this.parentNode?.removeChild(this)
        }
    }

    export class RendererBaseNode
        extends MiniDom.BaseNode
        implements Lunch.MetaBase
    {
        constructor(
            options: Partial<Lunch.MetaBase> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.minidomType = 'RendererNode'

            this.eventListeners = {}
            this.eventListenerRemoveFunctions = {}
            this.name = options.name ?? ''
            this.metaType = options.metaType ?? 'standardMeta'
            this.props = options.props ?? []
            this.type = options.type ?? ''
        }

        eventListeners: Record<string, Lunch.EventCallback[]>
        eventListenerRemoveFunctions: Record<string, Function[]>
        name: string | null
        metaType: Lunch.MetaType
        props: Lunch.LunchboxMetaProps
        type: string | null

        drop() {
            super.drop()
            // handle remove functions
            Object.keys(this.eventListenerRemoveFunctions).forEach((key) => {
                this.eventListenerRemoveFunctions[key].forEach((func) => func())
            })
        }
    }

    // ====================
    // SPECIFIC RENDERER NODES BELOW
    // ====================

    export class RendererRootNode
        extends MiniDom.RendererBaseNode
        implements Lunch.RootMeta
    {
        constructor(
            options: Partial<Lunch.RootMeta> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.domElement =
                options.domElement ?? document.createElement('div')
        }

        domElement: HTMLElement
        isLunchboxRootNode = true
    }

    export class RendererCommentNode
        extends MiniDom.RendererBaseNode
        implements Lunch.CommentMeta
    {
        constructor(
            options: Partial<Lunch.CommentMeta> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.text = options.text ?? ''
        }

        text: string
    }

    export class RendererDomNode
        extends MiniDom.RendererBaseNode
        implements Lunch.DomMeta
    {
        constructor(
            options: Partial<Lunch.DomMeta> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.domElement =
                options.domElement ?? document.createElement('div')
        }

        domElement: HTMLElement
    }

    export class RendererTextNode
        extends MiniDom.RendererBaseNode
        implements Lunch.TextMeta
    {
        constructor(
            options: Partial<Lunch.TextMeta> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.text = options.text ?? ''
        }

        text: string
    }

    export class RendererStandardNode<T = THREE.Object3D>
        extends MiniDom.RendererBaseNode
        implements Lunch.StandardMeta<T>
    {
        constructor(
            options: Partial<Lunch.StandardMeta<T>> = {},
            parent?: MiniDom.BaseNode
        ) {
            super(options, parent)
            this.attached = options.attached ?? []
            this.attachedArray = options.attachedArray ?? {}
            this.instance = options.instance ?? null
        }

        attached: { [key: string]: any }
        attachedArray: { [key: string]: Array<any> }
        instance: T | null
    }

    export type NodeType = 'MinidomBaseNode' | 'RendererNode' | 'RootNode'
}

export function isMinidomNode(item: any): item is MiniDom.RendererBaseNode {
    return (item as MiniDom.BaseNode)?.minidomType === 'RendererNode'
}

// export const rootNode = new MiniDom.RendererRootNode()
// rootNode.minidomType = 'RootNode'
