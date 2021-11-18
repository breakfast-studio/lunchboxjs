import { createDomNode, createNode } from '../core'
import { isLunchboxDomComponent } from '../utils'
import { Lunch } from '..'

const autoAttach = [
    'geometry',
    'material',
]

export const createElement = (
    type: string,
    isSVG?: boolean,
    isCustomizedBuiltin?: string,
    vnodeProps?: Lunch.LunchboxMetaProps
) => {
    const options = { type } as Partial<Lunch.MetaBase>
    if (vnodeProps) {
        options.props = vnodeProps
    }

    // handle dom node
    const isDomNode = isLunchboxDomComponent(type)
    if (isDomNode) {
        const node = createDomNode(options)
        return node
    }

    // handle standard node
    const node = createNode(options)

    // autoattach
    autoAttach.forEach(key => {
        if (type.toLowerCase().endsWith(key)) {
            node.props.attach = key
        }
    })
    // TODO: array autoattach

    return node
}