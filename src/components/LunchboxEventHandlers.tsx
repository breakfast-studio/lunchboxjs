import { defineComponent, onBeforeUnmount, ref, watch } from 'vue'
import {
    Lunch,
    useCamera,
    useGlobals,
    useLunchboxInteractables,
    useRenderer,
} from '..'
import * as THREE from 'three'
import { offBeforeRender, onBeforeRender } from '../core'

export const LunchboxEventHandlers = defineComponent({
    name: 'LunchboxEventHandlers',
    setup() {
        const interactables = useLunchboxInteractables()
        const camera = useCamera()
        const renderer = useRenderer()
        const globals = useGlobals()
        const mousePos = ref({ x: Infinity, y: Infinity })
        const inputActive = ref(false)

        let currentIntersections: Array<{
            element: Lunch.Node
            intersection: THREE.Intersection<THREE.Object3D>
        }> = []

        const raycaster = new THREE.Raycaster(
            new THREE.Vector3(),
            new THREE.Vector3(0, 0, -1)
        )

        const fireEventsFromIntersections = ({
            element,
            eventKeys,
            intersection,
        }: {
            element: Lunch.Node
            eventKeys: Array<Lunch.EventKey>
            intersection: THREE.Intersection<THREE.Object3D>
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

        // add mouse listener to renderer DOM element when the element is ready
        const stopWatch = watch(
            renderer,
            (v) => {
                if (!v?.domElement) return

                // we have a DOM element, so let's add mouse listeners
                const { domElement } = v

                const mouseMoveListener = (evt: PointerEvent) => {
                    const screenWidth = (domElement.width ?? 1) / globals.dpr
                    const screenHeight = (domElement.height ?? 1) / globals.dpr
                    mousePos.value.x = (evt.offsetX / screenWidth) * 2 - 1
                    mousePos.value.y = -(evt.offsetY / screenHeight) * 2 + 1
                }
                const mouseDownListener = () => (inputActive.value = true)
                const mouseUpListener = () => (inputActive.value = false)

                // add mouse events
                domElement.addEventListener('pointermove', mouseMoveListener)
                domElement.addEventListener('pointerdown', mouseDownListener)
                domElement.addEventListener('pointerup', mouseUpListener)

                // stop the watcher
                stopWatch()
            },
            { immediate: true }
        )

        const update = () => {
            const c = camera.value
            if (!c) return

            raycaster.setFromCamera(mousePos.value, c)
            const intersections = raycaster.intersectObjects(
                interactables?.value.map(
                    (v) => v.instance as any as THREE.Object3D
                ) ?? []
            )

            let enterValues: Array<THREE.Intersection<THREE.Object3D>> = [],
                sameValues: Array<THREE.Intersection<THREE.Object3D>> = [],
                leaveValues: Array<THREE.Intersection<THREE.Object3D>> = [],
                entering: Array<{
                    element: Lunch.Node
                    intersection: THREE.Intersection<THREE.Object3D>
                }> = [],
                staying: Array<{
                    element: Lunch.Node
                    intersection: THREE.Intersection<THREE.Object3D>
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

                    const found = interactables?.value.find(
                        (v) => v.instance?.uuid === intersection.object.uuid
                    )
                    if (found) {
                        entering.push({ element: found, intersection })
                    }
                } else {
                    // existing intersection
                    sameValues.push(intersection)

                    const found = interactables?.value.find(
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
                intersection: THREE.Intersection<THREE.Object3D>
            }> = leaveValues.map((intersection) => {
                return {
                    element: interactables?.value.find(
                        (interactable) =>
                            interactable.instance?.uuid ===
                            intersection.object.uuid
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
                fireEventsFromIntersections({
                    element,
                    eventKeys,
                    intersection,
                })
            })

            // exited interactions
            leaving.forEach(({ element, intersection }) => {
                const eventKeys: Array<Lunch.EventKey> = [
                    'onPointerLeave',
                    'onPointerOut',
                ]
                fireEventsFromIntersections({
                    element,
                    eventKeys,
                    intersection,
                })
            })

            currentIntersections = ([] as any).concat(entering, staying)
        }

        // update function
        onBeforeRender(update)

        const teardown = () => offBeforeRender(update)
        onBeforeUnmount(teardown)

        const clickEventKeys: Lunch.EventKey[] = [
            'onClick',
            'onPointerDown',
            'onPointerUp',
        ]
        watch(inputActive, (isDown) => {
            // meshes with multiple intersections receive multiple callbacks by default -
            // let's make it so they only receive one callback of each type per frame.
            // (ie usually when you click on a mesh, you expect only one click event to fire, even
            // if there are technically multiple intersections with that mesh)
            const uuidsInteractedWithThisFrame: string[] = []
            currentIntersections.forEach((v) => {
                clickEventKeys.forEach((key) => {
                    const id = v.element.uuid + key
                    if (
                        isDown &&
                        (key === 'onClick' || key === 'onPointerDown')
                    ) {
                        if (!uuidsInteractedWithThisFrame.includes(id)) {
                            v.element.eventListeners[key]?.forEach((cb) =>
                                cb({ intersection: v.intersection })
                            )
                            uuidsInteractedWithThisFrame.push(id)
                        }
                    } else if (!isDown && key === 'onPointerUp') {
                        if (!uuidsInteractedWithThisFrame.includes(id)) {
                            v.element.eventListeners[key]?.forEach((cb) =>
                                cb({ intersection: v.intersection })
                            )
                            uuidsInteractedWithThisFrame.push(id)
                        }
                    }
                })
            })
        })

        // return arbitrary object to ensure instantiation
        // TODO: why can't we return a <raycaster/> here?
        return () => <object3D />
    },
})
