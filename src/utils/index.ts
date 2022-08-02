import { Lunch } from '..'

export * from './find'

// MAKE SURE THESE MATCH VALUES IN types.EventKey
/** Type check on whether target is a Lunchbox.EventKey */
export const isEventKey = (target: any): target is Lunch.EventKey => {
    return [
        'onClick',
        'onContextMenu',
        'onDoubleClick',
        'onPointerUp',
        'onPointerDown',
        'onPointerOver',
        'onPointerOut',
        'onPointerEnter',
        'onPointerLeave',
        'onPointerMove',
        // 'onPointerMissed',
        // 'onUpdate',
        'onWheel',
    ].includes(target)
}

export const isLunchboxComponent = (
    node: any
): node is Lunch.LunchboxComponent => {
    return node?.$el && node?.$el?.hasOwnProperty?.('instance')
}

export const isLunchboxDomComponent = (node: any): node is Lunch.DomMeta => {
    if ((node as Lunch.MetaBase)?.metaType === 'domMeta') return true

    return node?.props?.['data-lunchbox']
}

export const isLunchboxStandardNode = (
    node: any
): node is Lunch.StandardMeta => {
    return node?.metaType === 'standardMeta'
}

export const isLunchboxRootNode = (node: any): node is Lunch.RootMeta => {
    return node.isLunchboxRootNode
}
