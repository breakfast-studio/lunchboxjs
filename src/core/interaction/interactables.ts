import { Lunch } from '../..'

export const interactables: Array<Lunch.Node> = []

export const addInteractable = (target: Lunch.Node) => {
    interactables.push(target)
}

export const removeInteractable = (target: Lunch.Node) => {
    const idx = interactables.indexOf(target)
    if (idx !== -1) {
        interactables.splice(idx, 1)
    }
}
