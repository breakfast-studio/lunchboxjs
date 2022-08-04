import { isEventKey, isLunchboxStandardNode } from '../utils'
import { addEventListener } from './interaction'
import { get, isNumber, set } from 'lodash'
import { Lunch } from '..'

/** Update the given node so all of its props are current. */
export function updateAllObjectProps({ node }: { node: Lunch.Node }) {
    // set props
    const props = node.props || {}
    let output = node
    Object.keys(props).forEach((key) => {
        output = updateObjectProp({ node, key, value: props[key] })
    })

    return output
}

/** Update a single prop on a given node. */
export function updateObjectProp({
    node,
    key,
    value,
}: {
    node: Lunch.Node
    key: string
    value: any
}) {
    // handle and return early if prop is an event
    // (event list from react-three-fiber)
    if (isEventKey(key)) {
        return addEventListener({ node, key, value })
    }

    // update THREE property
    // get final key
    const camelKey = key.replace(/-/g, '.')
    const finalKey = propertyShortcuts[camelKey] || camelKey

    // handle and return early if prop is specific to Vue/Lunchbox
    if (
        internalLunchboxVueKeys.includes(key) ||
        internalLunchboxVueKeys.includes(finalKey)
    )
        return node

    // everything else should be Three-specific, so let's cancel if this isn't a standard node
    if (!isLunchboxStandardNode(node)) return node

    // parse $attached values
    if (typeof value === 'string' && value.startsWith('$attached')) {
        const attachedName = value.replace('$attached.', '')
        value = get(node.attached, attachedName, null)
    }

    // save instance
    const target = node.instance

    // cancel if no target
    if (!target) return node

    // burrow down until we get property to change
    let liveProperty
    for (let i = 0; i < nestedPropertiesToCheck.length && !liveProperty; i++) {
        const nestedProperty = nestedPropertiesToCheck[i]
        const fullPath = [nestedProperty, finalKey].filter(Boolean).join('.')
        liveProperty = liveProperty = get(target, fullPath)
    }

    // change property
    // first, save as array in case we need to spread it
    if (liveProperty && isNumber(value) && liveProperty.setScalar) {
        // if value is a number and the property has a `setScalar` method, use that
        liveProperty.setScalar(value)
    } else if (liveProperty && liveProperty.set) {
        // if property has `set` method, use that (https://github.com/pmndrs/react-three-fiber/blob/master/markdown/api.md#shortcuts)
        const nextValueAsArray = Array.isArray(value) ? value : [value]
        ;(target as any)[finalKey].set(...nextValueAsArray)
    } else if (typeof liveProperty === 'function') {
        // some function properties are set rather than called, so let's handle them
        if (
            finalKey.toLowerCase() === 'onbeforerender' ||
            finalKey.toLowerCase() === 'onafterrender'
        ) {
            ;(target as any)[finalKey] = value
        } else {
            if (!Array.isArray(value)) {
                throw new Error(
                    'Arguments on a declarative method must be wrapped in an array.\nWorks:\n<example :methodCall="[256]" />\nDoesn\'t work:\n<example :methodCall="256" />'
                )
            }
            // if property is a function, let's try calling it
            liveProperty.bind(node.instance)(...value)
        }

        // pass the result to the parent
        // const parent = node.parentNode
        // if (parent) {
        //     const parentAsLunchboxNode = parent as Lunchbox.Node
        //     parentAsLunchboxNode.attached[finalKey] = result
        //         ; (parentAsLunchboxNode.instance as any)[finalKey] = result
        // }
    } else if (get(target, finalKey, undefined) !== undefined) {
        // blank strings evaluate to `true`
        // <mesh castShadow receiveShadow /> will work the same as
        // <mesh :castShadow="true" :receiveShadow="true" />
        set(target, finalKey, value === '' ? true : value)
    } else {
        // if you see this error in production, you might need to add `finalKey`
        // to `internalLunchboxVueKeys` below
        console.log(`No property ${finalKey} found on ${target}`)
    }

    // mark that we need to update if needed
    const targetTypeRaw =
        (target as any)?.texture?.type || (target as any)?.type
    if (typeof targetTypeRaw === 'string') {
        const targetType = targetTypeRaw.toLowerCase()

        switch (true) {
            case targetType.includes('material'):
                ;(target as unknown as THREE.Material).needsUpdate = true
                break
            case targetType.includes('camera') &&
                (target as any).updateProjectionMatrix:
                ;(
                    target as unknown as
                        | THREE.PerspectiveCamera
                        | THREE.OrthographicCamera
                ).updateProjectionMatrix()
                break
        }
    }

    return node
}

const propertyShortcuts: { [key: string]: string } = {
    x: 'position.x',
    y: 'position.y',
    z: 'position.z',
}

export const nestedPropertiesToCheck = ['', 'parameters']

/** props that Lunchbox intercepts and prevents passing to created instances */
const internalLunchboxVueKeys = [
    'args',
    'attach',
    'attachArray',
    'is.default',
    'isDefault',
    'key',
    'onAdded',
    // 'onReady',
    'ref',
    'src',
]
