import { Lunch } from '..'

export const startCallbacks = [] as Lunch.UpdateCallback[]

export const onStart = (cb: Lunch.UpdateCallback, index = Infinity) => {
    if (index === Infinity) {
        startCallbacks.push(cb)
    } else {
        startCallbacks.splice(index, 0, cb)
    }
}
