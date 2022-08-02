type RendererStandardNode<T = THREE.Object3D> =
    import('./core').MiniDom.RendererStandardNode<T>
type RootNode = import('./core/minidom').MiniDom.RendererRootNode
type VNodeProps = import('vue').VNodeProps
type VueApp<T> = import('vue').App<T>
type WatchSource = import('vue').WatchSource
type WatchStopHandle = import('vue').WatchStopHandle

export declare namespace Lunch {
    /** Lunchbox app. */
    type App = Omit<VueApp<any>, 'config'> & {
        clearCustomRender: () => void
        config: Omit<VueApp<any>['config'], 'globalProperties'> & {
            globalProperties: {
                lunchbox: {
                    afterRender: Lunch.UpdateCallback[]
                    beforeRender: Lunch.UpdateCallback[]
                    frameId: number
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

    type AppGlobals = {
        /** Device pixel resolution */
        dpr: number
    }

    type AppGlobalsUpdate = (newValue: Partial<AppGlobals>) => void

    interface CanvasProps {
        dpr?: number
        wrapperProps?: WrapperProps
    }

    /** Lunchbox component catalogue. */
    interface Catalogue {
        [key: string]: {
            new (...args: any): { [key: string]: any }
        }
    }

    interface CommentMeta extends MetaBase {
        text: string
    }

    type CustomRenderFunctionSetter = (
        render: (opts: Lunch.UpdateCallbackProperties) => void
    ) => void

    interface DomMeta extends MetaBase {
        domElement: HTMLElement
    }

    type EventCallback = (options: {
        intersection: THREE.Intersection<any>
    }) => void

    // MAKE SURE THESE MATCH VALUES IN lib.isEventKey
    type EventKey =
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

    interface GenericThreeLoader<T = any> {
        load(
            src: string,
            onLoad: (data: T) => void,
            onProgress: null,
            onError: (error: any) => void
        ): void
    }

    /** Meta info needed on a standard Lunchbox node. */
    interface StandardMeta<T = THREE.Object3D> extends MetaBase {
        attached: { [key: string]: any }
        attachedArray: { [key: string]: Array<any> }
        instance: T | null
    }

    /** Meta info that every node needs. */
    interface MetaBase {
        name: string | null | undefined
        metaType: MetaType
        props: LunchboxMetaProps
        type: string | null
        uuid: Uuid
    }

    type MetaType =
        | 'commentMeta'
        | 'domMeta'
        | 'standardMeta'
        | 'metaBase'
        | 'rootMeta'
        | 'textMeta'

    interface RootMeta extends MetaBase {
        domElement: HTMLElement
        isLunchboxRootNode: boolean
    }

    type ShadowSugar =
        | boolean
        | {
              type: THREE.ShadowMapType
          }

    interface TextMeta extends MetaBase {
        text: string
    }

    /** Props that can be passed to any Lunchbox meta. */
    type LunchboxMetaProps = VNodeProps & {
        args?: Array<any>
        attach?: string
        onAdded?<T>(opts: { instance: T | null }): void

        [key: string]: any
    }

    type LunchboxComponent<T = THREE.Object3D> = {
        $el: Node<T>
    }

    type Node<T = THREE.Object3D> = RendererStandardNode<T>

    type UpdateCallback = (properties: UpdateCallbackProperties) => void

    interface UpdateCallbackProperties {
        app: App
        scene?: THREE.Scene | null
        renderer?: THREE.Renderer | null
        camera?: THREE.Camera | null
        updateSource?: WatchSource | null

        // sceneNode: Node<THREE.Scene> | null
        // rendererNode: Node<THREE.Renderer> | null
        // cameraNode: Node<THREE.Camera> | null
    }

    /** Universally unique identifier. */
    type Uuid = string

    type SizePolicy = 'full' | 'container'

    type Vector3AsArray = [number, number, number]

    interface WrapperProps {
        background?: string
        cameraArgs?: any[]
        cameraLook?: Vector3AsArray
        cameraLookAt?: Vector3AsArray
        cameraPosition?: Vector3AsArray
        dpr?: number
        ortho?: boolean
        orthographic?: boolean
        r3f?: boolean
        // TODO: Why doesn't ConstructorParameters<THREE.WebGLRenderer> work here?
        rendererArguments?: object
        rendererProperties?: Partial<THREE.WebGLRenderer>
        sizePolicy?: SizePolicy
        shadow?: ShadowSugar
        transparent?: boolean
        zoom?: number
        updateSource?: WatchSource | null
    }
}
