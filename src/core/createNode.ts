import { isLunchboxRootNode } from '../utils'
import { instantiateThreeObject, MiniDom } from '.'
import { Lunch } from '..'
import { ensuredCamera } from './ensure'

/** Create a new Lunchbox comment node. */
export function createCommentNode(options: Partial<Lunch.CommentMeta> = {}) {
    const defaults: Omit<Lunch.CommentMeta, keyof Lunch.MetaBase> = {
        text: options.text ?? '',
    }
    return new MiniDom.RendererCommentNode({
        ...defaults,
        ...options,
        metaType: 'commentMeta',
    })
}

/** Create a new DOM node. */
export function createDomNode(options: Partial<Lunch.DomMeta> = {}) {
    const domElement = document.createElement(options.type ?? '')
    const defaults: Omit<Lunch.DomMeta, keyof Lunch.MetaBase> = {
        domElement,
    }

    const node = new MiniDom.RendererDomNode({
        ...defaults,
        ...options,
        metaType: 'domMeta',
    })
    return node
}

/** Create a new Lunchbox text node. */
export function createTextNode(options: Partial<Lunch.TextMeta> = {}) {
    const defaults: Omit<Lunch.CommentMeta, keyof Lunch.MetaBase> = {
        text: options.text ?? '',
    }
    return new MiniDom.RendererTextNode({
        ...options,
        ...defaults,
        metaType: 'textMeta',
    })
}

/** Create a new Lunchbox standard node. */
export function createNode<T extends object = THREE.Object3D>(
    options: Partial<Lunch.StandardMeta<T>> = {},
    props: Lunch.LunchboxMetaProps = {}
) {
    const defaults: Omit<Lunch.StandardMeta<T>, keyof Lunch.MetaBase> = {
        attached: options.attached ?? [],
        attachedArray: options.attachedArray ?? {},
        instance: options.instance ?? null,
    }
    const node = new MiniDom.RendererStandardNode<T>({
        ...options,
        ...defaults,
        metaType: 'standardMeta',
    })

    if (node.type && !isLunchboxRootNode(node) && !node.instance) {
        // if (node.type.includes('Camera')) {
        //     console.log(node.type, {
        //         ...node.props,
        //         ...props,
        //     })
        //     console.trace()
        // }
        node.instance = instantiateThreeObject({
            ...node,
            props: {
                ...node.props,
                ...props,
            },
        })
    }

    // TODO: these manual overrides are a bit brittle - replace?
    if (node.type?.toLowerCase() === 'scene') {
        // manually set scene override
        // ensuredScene.value = node as Lunch.Node<THREE.Scene>
    } else if (node.type?.toLowerCase().endsWith('camera')) {
        ensuredCamera.value = node as Lunch.Node<THREE.Camera>
    }

    return node
}
