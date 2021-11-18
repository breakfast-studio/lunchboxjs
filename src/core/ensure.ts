import { allNodes, createNode, MiniDom } from '.'
import { setupAutoRaycaster } from './interaction/setupAutoRaycaster'
import { ref } from 'vue'
import { Lunch } from '..'

// ENSURE ROOT
// ====================
export const rootUuid = 'LUNCHBOX_ROOT'
export let lunchboxRootNode: MiniDom.RendererRootNode
export function ensureRootNode(options: Partial<Lunch.RootMeta> = {}) {
    if (!lunchboxRootNode) {
        lunchboxRootNode = new MiniDom.RendererRootNode(options)
    }
    return lunchboxRootNode
}

// ENSURE CAMERA
// ====================
export const fallbackCameraUuid = 'FALLBACK_CAMERA'
export const createdCamera = ref<Lunch.Node<THREE.Camera> | null>(null)
export const ensureCamera = () => {
    // look for cameras
    // TODO: does this need to be more robust?
    const foundCamera = allNodes.find((node) =>
        (node as MiniDom.RendererBaseNode).type
            ?.toLowerCase()
            .includes('camera')
    )

    // if we have one, return
    if (foundCamera) {
        const cameraAsStandardNode =
            foundCamera as MiniDom.RendererStandardNode<THREE.Camera>
        createdCamera.value = cameraAsStandardNode
        return cameraAsStandardNode
    }

    // otherwise, create a new camera
    const root = ensureRootNode()
    const cameraNode = createNode<THREE.Camera>({
        type: 'PerspectiveCamera',
        uuid: fallbackCameraUuid,
        props: {
            args: [45, 0.5625, 1, 1000],
        },
    })
    root.addChild(cameraNode)
    createdCamera.value = cameraNode

    // add camera to scene
    ensureScene().instance?.add(cameraNode.instance!)
    return cameraNode
}

// ENSURE RENDERER
// ====================
export const fallbackRendererUuid = 'FALLBACK_RENDERER'
export const createdRenderer = ref<Lunch.Node<THREE.Renderer> | null>(null)
export const ensureRenderer = (
    fallbackArgs: Array<THREE.WebGLRendererParameters> = [],
    sugar: {
        shadow?: Lunch.ShadowSugar
    } = {}
) => {
    // look for renderers
    // TODO: does this need to be more robust?
    const foundRenderer = allNodes.find((node) =>
        (node as MiniDom.RendererBaseNode).type
            ?.toLowerCase()
            .includes('renderer')
    )

    // if we have one, return
    if (foundRenderer) {
        const rendererAsStandardNode =
            foundRenderer as MiniDom.RendererStandardNode<THREE.WebGLRenderer>
        createdRenderer.value = rendererAsStandardNode
        return rendererAsStandardNode
    }

    // otherwise, create a new renderer
    const root = ensureRootNode()
    const rendererNode = createNode<THREE.WebGLRenderer>(
        {
            type: 'WebGLRenderer',
            uuid: fallbackRendererUuid,
        },
        { args: fallbackArgs }
    )

    // shadow sugar
    if (sugar?.shadow) {
        rendererNode.instance!.shadowMap.enabled = true
        if (typeof sugar.shadow === 'object') {
            rendererNode.instance!.shadowMap.type = sugar.shadow.type
        }
    }

    root.addChild(rendererNode)
    createdRenderer.value = rendererNode

    // return created node
    return rendererNode
}

// ENSURE SCENE
// ====================
export const fallbackSceneUuid = 'FALLBACK_SCENE'
export const createdScene = ref<Lunch.Node<THREE.Scene>>()
export const ensureScene = () => {
    // look for scenes
    const foundScene = allNodes.find(
        (node) =>
            (node as MiniDom.RendererBaseNode).type?.toLowerCase() === 'scene'
    )
    // if we have one, return
    if (foundScene) {
        const sceneAsLunchboxNode =
            foundScene as MiniDom.RendererStandardNode<THREE.Scene>
        createdScene.value = sceneAsLunchboxNode
        return sceneAsLunchboxNode
    }

    // otherwise, create a new scene
    const root = ensureRootNode()
    const sceneNode = createNode<THREE.Scene>({
        type: 'Scene',
        uuid: fallbackSceneUuid,
    })
    root.addChild(sceneNode)
    createdScene.value = sceneNode
    return sceneNode
}

// ENSURE AUTO-RAYCASTER
export const autoRaycasterUuid = 'AUTO_RAYCASTER'
export const createdRaycaster = ref<Lunch.Node<THREE.Raycaster> | null>(null)
export const ensureRaycaster = () => {
    // look for autoraycaster
    const found = allNodes.find(
        (node) => (node as Lunch.Node).uuid === autoRaycasterUuid
    )
    // if we have one, return
    if (found) {
        const foundAsNode = found as Lunch.Node<THREE.Raycaster>
        createdRaycaster.value = foundAsNode
        return foundAsNode
    }

    // otherwise, create raycaster
    const root = ensureRootNode()
    const raycasterNode = createNode<THREE.Raycaster>({
        type: 'Raycaster',
        uuid: autoRaycasterUuid,
    })
    root.addChild(raycasterNode)
    createdRaycaster.value = raycasterNode

    // finish auto-raycaster setup
    setupAutoRaycaster(raycasterNode)

    // done with raycaster
    return raycasterNode
}
