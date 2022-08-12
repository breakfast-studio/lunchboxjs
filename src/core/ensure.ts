// import { allNodes, createNode, isMinidomNode, MiniDom } from '.'
// import { setupAutoRaycaster } from './interaction/setupAutoRaycaster'
import {
    ComputedRef,
    computed,
    inject,
    reactive,
    ref,
    WritableComputedRef,
} from 'vue'
import { Lunch } from '..'
import * as Keys from '../keys'

// ENSURE ROOT
// ====================
// export const rootUuid = 'LUNCHBOX_ROOT'
// export let lunchboxRootNode: MiniDom.RendererRootNode
// export function ensureRootNode(options: Partial<Lunch.RootMeta> = {}) {
//     if (!lunchboxRootNode) {
//         lunchboxRootNode = new MiniDom.RendererRootNode(options)
//     }
//     return lunchboxRootNode
// }

// This is used in `buildEnsured` below and `LunchboxWrapper`
/** Search the overrides record and the node tree for a node in the given types */
// export function tryGetNodeWithInstanceType<T extends THREE.Object3D>(
//     pascalCaseTypes: string | string[]
// ) {
//     if (!Array.isArray(pascalCaseTypes)) {
//         pascalCaseTypes = [pascalCaseTypes]
//     }

//     // default to override if we have one
//     for (let singleType of pascalCaseTypes) {
//         if (overrides[singleType]) return overrides[singleType] as Lunch.Node<T>
//     }

//     // look for auto-created node
//     for (let singleType of pascalCaseTypes) {
//         const found =
//             autoCreated[singleType] ||
//             allNodes.find(
//                 (node) =>
//                     (node as MiniDom.RendererBaseNode).type?.toLowerCase() ===
//                     singleType.toLowerCase()
//             )

//         // cancel if found example is marked !isDefault
//         if (
//             isMinidomNode(found) &&
//             (found.props['is-default'] === false ||
//                 !found.props['isDefault'] === false)
//         ) {
//             return null
//         }

//         // if we have one, save and return
//         if (found) {
//             const createdAsNode = found as MiniDom.RendererStandardNode<T>
//             autoCreated[singleType] = createdAsNode
//             return createdAsNode
//         }
//     }

//     return null
// }

// GENERIC ENSURE FUNCTION
// ====================
// Problem:
// I want to make sure an object of type Xyz exists in my Lunchbox app.
// If it doesn't exist, I want to create it and add it to the root node.
//
// Solution:
// export const ensuredXyz = buildEnsured<Xyz>('Xyz', 'FALLBACK_XYZ')
//
// Now in other components, you can do both:
// import { ensuredXyz }
// ensuredXyz.value (...)
// and:
// ensuredXyz.value = ...
// export const autoCreated: Record<string, Lunch.Node | null> = reactive({})
// export const overrides: Record<string, Lunch.Node | null> = reactive({})

/**
 * Build a computed ensured value with a getter and setter.
 * @param pascalCaseTypes List of types this can be. Will autocreate first type if array provided.
 * @param fallbackUuid Fallback UUID to use.
 * @param props Props to pass to autocreated element
 * @returns Computed getter/setter for ensured object.
 */
// function buildEnsured<T extends THREE.Object3D>(
//     pascalCaseTypes: string | string[],
//     fallbackUuid: string,
//     props: Record<string, any> = {},
//     callback: ((node: MiniDom.RendererStandardNode<T>) => void) | null = null
// ) {
//     // make sure we've got an array
//     if (!Array.isArray(pascalCaseTypes)) {
//         pascalCaseTypes = [pascalCaseTypes]
//     }

//     // add type for autoCreated and overrides
//     for (let singleType of pascalCaseTypes) {
//         if (!autoCreated[singleType]) {
//             autoCreated[singleType] = null
//         }
//         if (!overrides[singleType]) {
//             overrides[singleType] = null
//         }
//     }

//     return computed({
//         get(): MiniDom.RendererStandardNode<T> {
//             // try to get existing type
//             const existing = tryGetNodeWithInstanceType<T>(
//                 pascalCaseTypes as string[]
//             )
//             if (existing) return existing

//             // otherwise, create a new node
//             const root = ensureRootNode()
//             const node = createNode<T>({
//                 type: pascalCaseTypes[0],
//                 uuid: fallbackUuid,
//                 props,
//             })
//             root.addChild(node)
//             autoCreated[pascalCaseTypes[0]] = node
//             if (callback) {
//                 callback(node)
//             }
//             return node
//         },
//         set(val: MiniDom.RendererStandardNode<T>) {
//             const t = val.type ?? ''
//             const pascalType = t[0].toUpperCase() + t.slice(1)
//             overrides[pascalType] = val
//         },
//     })
// }

// ENSURE CAMERA
// ====================
// export const fallbackCameraUuid = 'FALLBACK_CAMERA'
// export const defaultCamera = buildEnsured(
//     ['PerspectiveCamera', 'OrthographicCamera'],
//     fallbackCameraUuid,
//     { args: [45, 0.5625, 1, 1000] }
// ) as unknown as WritableComputedRef<Lunch.Node<THREE.Camera>>
/** Special value to be changed ONLY in `LunchboxWrapper`.
 * Functions waiting for a Camera need to wait for this to be true.  */
// export const cameraReady = ref(false)

export const ensuredCamera = <T extends THREE.Camera = THREE.Camera>() =>
    inject<ComputedRef<T>>(Keys.appCameraKey)!
// computed<Lunch.Node<THREE.Camera> | null>({
//     get() {
//         return (
//             cameraReady.value ? (defaultCamera.value as any) : (null as any)
//         ) as any
//     },
//     set(val: any) {
//         const t = val.type ?? ''
//         const pascalType = t[0].toUpperCase() + t.slice(1)
//         overrides[pascalType] = val as any
//     },
// })

// ENSURE RENDERER
// ====================
export const ensureRenderer = <
    T extends THREE.Renderer = THREE.WebGLRenderer
>() => inject<ComputedRef<T>>(Keys.appRenderersKey)

// ENSURE SCENE
// ====================
// export const fallbackSceneUuid = 'FALLBACK_SCENE'
// export const ensuredScene = buildEnsured<THREE.Scene>(
//     'Scene',
//     fallbackSceneUuid
// )
export const ensuredScene = <T extends THREE.Scene = THREE.Scene>() =>
    inject<ComputedRef<T>>(Keys.appSceneKey)

// ENSURE AUTO-RAYCASTER
// export const autoRaycasterUuid = 'AUTO_RAYCASTER'
// `unknown` is intentional here - we need to typecast the node since Raycaster isn't an Object3D
// export const ensuredRaycaster = buildEnsured(
//     'Raycaster',
//     autoRaycasterUuid,
//     {},
//     (node) => setupAutoRaycaster(node as unknown as Lunch.Node<THREE.Raycaster>)
// ) as unknown as WritableComputedRef<Lunch.Node<THREE.Raycaster>>
