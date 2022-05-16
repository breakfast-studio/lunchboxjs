import { interactables } from '.'
import {
    ensuredCamera,
    ensuredRaycaster,
    ensureRenderer,
    onBeforeRender,
} from '..'
import { globals, Lunch } from '../../'
import { ref, watch, WatchStopHandle } from 'vue'
import { inputActive } from './input'
import { Intersection } from 'three'

let mouseMoveListener: (event: MouseEvent) => void
let mouseDownListener: (event: MouseEvent) => void
let mouseUpListener: (event: MouseEvent) => void

export const mousePos = ref({ x: Infinity, y: Infinity })
let autoRaycasterEventsInitialized = false

export const setupAutoRaycaster = (node: Lunch.Node<THREE.Raycaster>) => {
    const instance = node.instance

    if (!instance) return

    // add mouse events once renderer is ready
    let stopWatcher: WatchStopHandle | null = null
    stopWatcher = watch(
        () => ensureRenderer.value,
        (renderer) => {
            // make sure renderer exists
            if (!renderer?.instance) return

            // cancel early if autoraycaster exists
            if (autoRaycasterEventsInitialized) {
                if (stopWatcher) stopWatcher()
                return
            }

            // create mouse events
            mouseMoveListener = (evt) => {
                const screenWidth =
                    (renderer.instance!.domElement.width ?? 1) /
                    globals.dpr.value
                const screenHeight =
                    (renderer.instance!.domElement.height ?? 1) /
                    globals.dpr.value

                mousePos.value.x = (evt.clientX / screenWidth) * 2 - 1
                mousePos.value.y = -(evt.clientY / screenHeight) * 2 + 1
            }
            mouseDownListener = () => (inputActive.value = true)
            mouseUpListener = () => (inputActive.value = false)

            // add mouse events
            renderer.instance.domElement.addEventListener(
                'mousemove',
                mouseMoveListener
            )
            renderer.instance.domElement.addEventListener(
                'mousedown',
                mouseDownListener
            )
            renderer.instance.domElement.addEventListener(
                'mouseup',
                mouseUpListener
            )

            // TODO: add touch events

            // add to update loop
            onBeforeRender(autoRaycasterBeforeRender)

            // mark complete
            autoRaycasterEventsInitialized = true

            // cancel setup watcher
            if (stopWatcher) {
                stopWatcher()
            }
        },
        { immediate: true }
    )
}

// AUTO-RAYCASTER CALLBACK
// ====================
export let currentIntersections: Array<{
    element: Lunch.Node
    intersection: Intersection<THREE.Object3D>
}> = []

const autoRaycasterBeforeRender = () => {
    // setup
    const raycaster = ensuredRaycaster.value?.instance
    const camera = ensuredCamera.value?.instance
    if (!raycaster || !camera) return

    raycaster.setFromCamera(globals.mousePos.value, camera)
    const intersections = raycaster.intersectObjects(
        interactables.map((v) => v.instance as any as THREE.Object3D)
    )

    let enterValues: Array<Intersection<THREE.Object3D>> = [],
        sameValues: Array<Intersection<THREE.Object3D>> = [],
        leaveValues: Array<Intersection<THREE.Object3D>> = [],
        entering: Array<{
            element: Lunch.Node
            intersection: Intersection<THREE.Object3D>
        }> = [],
        staying: Array<{
            element: Lunch.Node
            intersection: Intersection<THREE.Object3D>
        }> = []

    // intersection arrays
    leaveValues = currentIntersections.map((v) => v.intersection)

    // element arrays
    intersections?.forEach((intersection) => {
        const currentIdx = currentIntersections.findIndex(
            (v) => v.intersection.object === intersection.object
        )
        if (currentIdx === -1) {
            // new intersection
            enterValues.push(intersection)

            const found = interactables.find(
                (v) => v.instance?.uuid === intersection.object.uuid
            )
            if (found) {
                entering.push({ element: found, intersection })
            }
        } else {
            // existing intersection
            sameValues.push(intersection)

            const found = interactables.find(
                (v) => v.instance?.uuid === intersection.object.uuid
            )
            if (found) {
                staying.push({ element: found, intersection })
            }
        }
        // this is a current intersection, so it won't be in our `leave` array
        const leaveIdx = leaveValues.findIndex(
            (v) => v.object.uuid === intersection.object.uuid
        )
        if (leaveIdx !== -1) {
            leaveValues.splice(leaveIdx, 1)
        }
    })

    const leaving: Array<{
        element: Lunch.Node
        intersection: Intersection<THREE.Object3D>
    }> = leaveValues.map((intersection) => {
        return {
            element: interactables.find(
                (interactable) =>
                    interactable.instance?.uuid === intersection.object.uuid
            ) as any as Lunch.Node,
            intersection,
        }
    })

    // new interactions
    entering.forEach(({ element, intersection }) => {
        fireEventsFromIntersections({
            element,
            eventKeys: ['onPointerEnter'],
            intersection,
        })
    })

    // unchanged interactions
    staying.forEach(({ element, intersection }) => {
        const eventKeys: Array<Lunch.EventKey> = [
            'onPointerOver',
            'onPointerMove',
        ]
        fireEventsFromIntersections({ element, eventKeys, intersection })
    })

    // exited interactions
    leaving.forEach(({ element, intersection }) => {
        const eventKeys: Array<Lunch.EventKey> = [
            'onPointerLeave',
            'onPointerOut',
        ]
        fireEventsFromIntersections({ element, eventKeys, intersection })
    })

    currentIntersections = ([] as any).concat(entering, staying)
}

// utility function for firing multiple callbacks and multiple events on a Lunchbox.Element
const fireEventsFromIntersections = ({
    element,
    eventKeys,
    intersection,
}: {
    element: Lunch.Node
    eventKeys: Array<Lunch.EventKey>
    intersection: Intersection<THREE.Object3D>
}) => {
    if (!element) return
    eventKeys.forEach((eventKey) => {
        if (element.eventListeners[eventKey]) {
            element.eventListeners[eventKey].forEach((cb) => {
                cb({ intersection })
            })
        }
    })
}
