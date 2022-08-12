import {
    isLunchboxDomComponent,
    isLunchboxRootNode,
    isLunchboxStandardNode,
} from '../utils'
import // ensureRootNode,
// ensuredScene
'../core'
import { MiniDom } from '../core/minidom'
import { Lunch } from '..'

export const insert = (
    child: MiniDom.RendererBaseNode,
    parent: MiniDom.RendererBaseNode | null,
    anchor?: MiniDom.RendererBaseNode | null
) => {
    if (!parent) {
        throw new Error('missing parent')
    }
    // add to parent tree node if we have one
    // let effectiveParent = parent ?? ensureRootNode()
    parent.insertBefore(child, anchor)

    // handle comment & text nodes
    if (child.metaType === 'commentMeta' || child.metaType === 'textMeta') {
        return
    }

    // handle dom element
    if (isLunchboxDomComponent(child)) {
        if (isLunchboxDomComponent(parent) || isLunchboxRootNode(parent)) {
            parent.domElement.appendChild(child.domElement)
        } else {
            // TODO: handle dom nodes as children of Lunchbox nodes
        }
    }

    // handle standard nodes
    if (isLunchboxStandardNode(child)) {
        // let effectiveParent = parent
        let effectiveParentNodeType = parent.metaType

        if (
            effectiveParentNodeType === 'textMeta' ||
            effectiveParentNodeType === 'commentMeta'
        ) {
            const path = parent.getPath() as MiniDom.RendererBaseNode[]
            for (let i = path.length - 1; i >= 0; i--) {
                if (
                    path[i].metaType !== 'textMeta' &&
                    path[i].metaType !== 'commentMeta'
                ) {
                    parent = path[i]
                    break
                }
            }
        }

        // add to scene if parent is the wrapper node
        // if (
        //     child.metaType === 'standardMeta' &&
        //     child.type !== 'scene' &&
        //     isLunchboxRootNode(effectiveParent)
        // ) {
        //     // ensure scene exists
        //     const sceneNode = ensuredScene()?.value

        //     if (sceneNode && child) {
        //         sceneNode.addChild(child)
        //     }
        //     if (
        //         child.instance &&
        //         child.instance.isObject3D &&
        //         sceneNode.instance
        //     ) {
        //         if (sceneNode !== child) {
        //             sceneNode.instance.add(child.instance)
        //         }
        //     }
        // }
        // // add to hierarchy otherwise
        // else
        if (
            isLunchboxStandardNode(child) &&
            child.instance?.isObject3D &&
            isLunchboxStandardNode(parent) &&
            parent.instance?.isObject3D
        ) {
            parent.instance?.add?.(child.instance)
        }

        // add attached props
        if (
            child?.props?.attach &&
            isLunchboxStandardNode(parent) &&
            parent?.instance
        ) {
            // if this element is a loader and the `src` attribute is being used,
            // let's assume we want to create the loader and run `load`
            const isUsingLoaderSugar =
                child.type?.toLowerCase().endsWith('loader') &&
                child.props.src &&
                (child.props.attach || child.props.attachArray)

            // run special loader behavior
            if (isUsingLoaderSugar) {
                runLoader(child, parent)
            } else {
                // update attached normally
                attachToParentInstance(child, parent, child.props.attach)
            }
        }

        // fire onAdded event
        if (child.props?.onAdded) {
            child.props.onAdded({
                instance: child.instance,
            })
        }
    }
}

function runLoader<T>(
    child: MiniDom.RendererStandardNode<T>,
    parent: MiniDom.RendererStandardNode
) {
    const loader = child.instance as any as Lunch.GenericThreeLoader
    // ensure parent has attached spaces ready
    parent.attached = parent.attached || {}
    parent.attachedArray = parent.attachedArray || {}

    // this should never be true, but just in case
    if (!child.props.attach) return

    if (child.type?.toLowerCase() === 'textureloader') {
        // if this is a texture loader, immediately pass
        // load function to parent attachment
        const textureLoader = loader as any as THREE.TextureLoader
        const inProgressTexture = textureLoader.load(child.props.src)

        attachToParentInstance(
            child,
            parent,
            child.props.attach,
            inProgressTexture
        )
    } else {
        // use a standard callback-based loader
        loader.load(
            child.props.src,
            (loadedData) => {
                attachToParentInstance(
                    child,
                    parent,
                    child.props.attach!,
                    loadedData
                )
            },
            null,
            (err) => {
                throw new Error(err)
            }
        )
    }
}

function attachToParentInstance<T>(
    child: MiniDom.RendererStandardNode<T>,
    parent: MiniDom.RendererStandardNode,
    key: string,
    value?: any
) {
    const finalValueToAttach = value ?? child.instance
    const parentInstanceAsAny = parent.instance as any

    if (child.props.attach === key) {
        parent.attached = {
            [key]: finalValueToAttach,
            ...(parent.attached || {}),
        }
        parentInstanceAsAny[key] = value ?? child.instance
    }

    if (child.props.attachArray === key) {
        if (!parent.attachedArray[child.props.attachArray]) {
            parent.attachedArray[child.props.attachArray] = []
        }
        parent.attachedArray[child.props.attachArray].push(finalValueToAttach)
        // TODO: implement auto-attaching array
        parentInstanceAsAny[key] = [parentInstanceAsAny[key]]
    }
}
