import { Lunch } from '..'
import { isLunchboxComponent, isLunchboxStandardNode } from '.'
import { isRef, isVNode } from 'vue'

export function find<T extends object>(target: any) {
    target = isRef(target) ? target.value : target

    // handle standard lunchbox node
    if (isLunchboxStandardNode(target)) {
        return (target as Lunch.Node<T>)?.instance
    }

    // handle component
    if (isLunchboxComponent(target)) {
        return (target as Lunch.LunchboxComponent<T>)?.$el?.instance
    }

    // handle vnode
    if (isVNode(target)) {
        return (target.el as Lunch.Node<T>)?.instance
    }

    return null
}
