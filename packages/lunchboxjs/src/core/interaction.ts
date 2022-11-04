import type { Ref } from 'vue'
import type { Lunch } from '..'

/** Add an event listener to the given node. Also creates the event teardown function and any necessary raycaster/interaction dictionary updates. */
export function addEventListener({
    node,
    key,
    interactables,
    value,
}: {
    node: Lunch.Node
    key: Lunch.EventKey
    interactables: Ref<Lunch.Node[]>
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
        if (node.instance && !interactables.value.includes(node)) {
            // add to interactables
            interactables.value.push(node)
            node.eventListenerRemoveFunctions[key].push(() => {
                // remove from interactables
                const idx = interactables.value.indexOf(node)
                if (idx !== -1) {
                    interactables.value.splice(idx, 1)
                }
            })
        }
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
