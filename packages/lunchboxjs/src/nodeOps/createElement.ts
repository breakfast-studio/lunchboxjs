import { createDomNode, createNode } from '../core'
import { isLunchboxDomComponent } from '../utils'
import { Lunch } from '..'

const autoAttach = ['geometry', 'material']

export const createElement = (
    type: string,
    _isSvg?: any,
    _isCustomizedBuiltin?: any,
    vnodeProps?: Lunch.LunchboxMetaProps
) => {
    const options: Partial<Lunch.MetaBase> = { type, props: vnodeProps }

    // handle dom node
    const isDomNode = isLunchboxDomComponent(options)
    if (isDomNode) {
        const node = createDomNode(options)
        return node
    }

    // handle standard node
    const node = createNode(options)

    // autoattach
    autoAttach.forEach((key) => {
        if (type.toLowerCase().endsWith(key)) {
            node.props.attach = key
        }
    })
    // TODO: array autoattach

    return node
}
