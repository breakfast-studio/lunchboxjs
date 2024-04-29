type Object3D = import('three').Object3D
type RendererStandardNode<T = Object3D> =
    import('./core').MiniDom.RendererStandardNode<T>
type RootNode = import('./core/minidom').MiniDom.RendererRootNode
type VNodeProps = import('vue').VNodeProps
type VueApp<T> = import('vue').App<T>
type WatchSource = import('vue').WatchSource
type WatchStopHandle = import('vue').WatchStopHandle
type ThreeCamera = import('three').Camera
type ThreeRenderer = import('three').Renderer
type ThreeScene = import('three').Scene
import * as THREE from 'three';

export namespace Lunch {
    /** Lunchbox app. */
    export type App = Omit<VueApp<any>, 'config'> & {
        clearCustomRender: () => void
        config: Omit<VueApp<any>['config'], 'globalProperties'> & {
            globalProperties: {
                lunchbox: {
                    afterRender: Lunch.UpdateCallback[]
                    beforeRender: Lunch.UpdateCallback[]
                    camera: ThreeCamera | null
                    dpr: number
                    frameId: number
                    renderer: ThreeRenderer | null
                    scene: ThreeScene | null
                    watchStopHandle: WatchStopHandle | null
                }
            } & Record<string, any>
        }
        customRender: ((opts: UpdateCallbackProperties) => void) | null
        extend: (v: Record<string, any>) => App
        rootNode: RootNode
        setCustomRender: (
            update: (opts: UpdateCallbackProperties) => void
        ) => void
        update: UpdateCallback
    }

    export type AppGlobals = App['config']['globalProperties']['lunchbox']

    export type AppGlobalsUpdate = (newValue: Partial<AppGlobals>) => void

    export interface CanvasProps {
        dpr?: number
        wrapperProps?: WrapperProps
    }

    /** Lunchbox component catalogue. */
    export interface Catalogue {
        [key: string]: {
            new(...args: any): { [key: string]: any }
        }
    }

    export interface CommentMeta extends MetaBase {
        text: string
    }

    export type CustomRenderFunctionSetter = (
        render: (opts: Lunch.UpdateCallbackProperties) => void
    ) => void

    export interface DomMeta extends MetaBase {
        domElement: HTMLElement
    }

    export type EventCallback = (options: {
        intersection: THREE.Intersection<any>
    }) => void

    // MAKE SURE THESE MATCH VALUES IN lib.isEventKey
    export type EventKey =
        | 'onClick'
        | 'onContextMenu'
        | 'onDoubleClick'
        | 'onPointerUp'
        | 'onPointerDown'
        | 'onPointerOver'
        | 'onPointerOut'
        | 'onPointerEnter'
        | 'onPointerLeave'
        | 'onPointerMove'
        // | 'onPointerMissed'
        // 'onUpdate' |
        | 'onWheel'

    export interface GenericThreeLoader<T = any> {
        load(
            src: string,
            onLoad: (data: T) => void,
            onProgress: null,
            onError: (error: any) => void
        ): void
    }

    /** Meta info needed on a standard Lunchbox node. */
    export interface StandardMeta<T = THREE.Object3D> extends MetaBase {
        attached: { [key: string]: any }
        attachedArray: { [key: string]: Array<any> }
        instance: T | null
    }

    /** Meta info that every node needs. */
    export interface MetaBase {
        name: string | null | undefined
        metaType: MetaType
        props: LunchboxMetaProps<any>
        type: string | null
        uuid: Uuid
    }

    export type MetaType =
        | 'commentMeta'
        | 'domMeta'
        | 'standardMeta'
        | 'metaBase'
        | 'rootMeta'
        | 'textMeta'

    export interface RootMeta extends MetaBase {
        domElement: HTMLElement
        isLunchboxRootNode: boolean
    }

    export type ShadowSugar =
        | boolean
        | {
            type: THREE.ShadowMapType
        }

    export interface TextMeta extends MetaBase {
        text: string
    }

    /** Props that can be passed to any Lunchbox meta. */
    export type LunchboxMetaProps<T extends abstract new (...args: any) => any> = VNodeProps & {
        args?: ConstructorParameters<T>
        attach?: string
        onAdded?(opts: { instance: T | null }): void

        [key: string]: any
    }

    export type LunchboxComponent<T = THREE.Object3D> = {
        $el: Node<T>
    }

    export type Node<T = THREE.Object3D> = RendererStandardNode<T>

    export type UpdateCallback = (properties: UpdateCallbackProperties) => void

    export interface UpdateCallbackProperties {
        app: App
        scene?: THREE.Scene | null
        renderer?: THREE.Renderer | null
        camera?: THREE.Camera | null
        updateSource?: WatchSource | null
    }

    /** Universally unique identifier. */
    export type Uuid = string

    export type SizePolicy = 'full' | 'container'

    export interface WrapperProps {
        /** The background color of the renderer. */
        background?: THREE.ColorRepresentation,
        cameraArgs?: any[]
        cameraLook?: THREE.Vector3Tuple
        cameraLookAt?: THREE.Vector3Tuple
        cameraPosition?: THREE.Vector3Tuple
        dpr?: number
        ortho?: boolean
        orthographic?: boolean
        r3f?: boolean
        rendererArguments?: ConstructorParameters<typeof THREE.WebGLRenderer>
        rendererProperties?: Partial<THREE.WebGLRenderer>
        sizePolicy?: SizePolicy
        shadow?: ShadowSugar
        transparent?: boolean
        zoom?: number
        updateSource?: WatchSource | null
    }
}

// Global components
// ==================
import type LunchboxWrapper from "./components/LunchboxWrapper/LunchboxWrapper.vue";

declare module '@vue/runtime-core' {
    export interface GlobalComponents {
        Lunchbox: typeof LunchboxWrapper,
    }
}