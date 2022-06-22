import { Lunch } from '../..'

/** Process props into either themselves or the $attached value */
export function processProp<T, U = THREE.Object3D>({
    node,
    prop,
}: {
    node: Lunch.StandardMeta<U>
    prop: any
}) {
    // return $attachedArray value if needed
    if (typeof prop === 'string' && prop.startsWith('$attachedArray')) {
        return node.attachedArray[
            prop.replace('$attachedArray.', '')
        ] as any as T
    }

    // return $attached value if needed
    if (typeof prop === 'string' && prop.startsWith('$attached')) {
        return node.attached[prop.replace('$attached.', '')] as T
    }

    // otherwise, return plain value
    return prop as T
}

export function processPropAsArray<T, U = THREE.Object3D>({
    node,
    prop,
}: {
    node: Lunch.StandardMeta<U>
    prop: any
}) {
    const isAttachedArray =
        typeof prop === 'string' && prop.startsWith('$attachedArray')
    const output = processProp<T, U>({ node, prop })
    return Array.isArray(output) && isAttachedArray
        ? (output as Array<T>)
        : [output]
}
