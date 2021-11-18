import { watch } from 'vue'
import {
    addInteractable,
    interactables,
    removeInteractable,
} from './interactables'
import { ensuredRaycaster } from '..'
import { inputActive } from './input'
import { currentIntersections } from '.'
import { Lunch } from '../..'

export * from './input'
export * from './interactables'
export * from './setupAutoRaycaster'

/** Add an event listener to the given node. Also creates the event teardown function and any necessary raycaster/interaction dictionary updates. */
export function addEventListener({
    node,
    key,
    value,
}: {
    node: Lunch.Node
    key: Lunch.EventKey
    value: Lunch.EventCallback
}) {
    // create new records for this key if needed
    if (!node.eventListeners[key]) {
        node.eventListeners[key] = []
    }
    if (!node.eventListenerRemoveFunctions[key]) {
        node.eventListenerRemoveFunctions[key] = []
    }

    // add event listener
    node.eventListeners[key].push(value)

    // if we need it, let's get/create the main raycaster
    if (interactionsRequiringRaycaster.includes(key)) {
        // we're not using `v` here, we're just making sure the raycaster has been created
        // TODO: is this necessary?
        const v = ensuredRaycaster.value

        if (node.instance && !interactables.includes(node)) {
            addInteractable(node)
            node.eventListenerRemoveFunctions[key].push(() =>
                removeInteractable(node)
            )
        }
    }

    // register click, pointerdown, pointerup
    if (key === 'onClick' || key === 'onPointerDown' || key === 'onPointerUp') {
        const stop = watch(
            () => inputActive.value,
            (isDown) => {
                const idx = currentIntersections
                    .map((v) => v.element)
                    .findIndex(
                        (v) =>
                            v.instance &&
                            v.instance.uuid === node.instance?.uuid
                    )
                if (idx !== -1) {
                    if (
                        isDown &&
                        (key === 'onClick' || key === 'onPointerDown')
                    ) {
                        node.eventListeners[key].forEach((func) => {
                            func({
                                intersection:
                                    currentIntersections[idx].intersection,
                            })
                        })
                    } else if (!isDown && key === 'onPointerUp') {
                        node.eventListeners[key].forEach((func) => {
                            func({
                                intersection:
                                    currentIntersections[idx].intersection,
                            })
                        })
                    }
                }
            }
        )

        node.eventListenerRemoveFunctions[key].push(stop)
    }

    return node
}

const interactionsRequiringRaycaster = [
    'onClick',
    'onPointerUp',
    'onPointerDown',
    'onPointerOver',
    'onPointerOut',
    'onPointerEnter',
    'onPointerLeave',
    'onPointerMove',
    // 'onPointerMissed',
]
