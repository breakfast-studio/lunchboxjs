import {
    Component,
    defineComponent,
    getCurrentInstance,
    inject,
    onMounted,
    onUnmounted,
    PropType,
    ref,
} from 'vue'
import { createApp, Lunch } from '../..'

export const BridgeComponent = defineComponent({
    name: 'BridgeComponent',
    props: {
        app: {
            type: Object as PropType<Lunch.App>,
        },
        root: {
            type: Object as PropType<Component>,
        },
        appSetup: {
            type: Function as PropType<(app: Lunch.App) => Lunch.App>,
            default: (app: Lunch.App) => app,
        },
    },
    setup(props, ctx) {
        // we need an app or root to mount
        if (!props.app && !props.root) {
            throw new Error('app or root required as <bridge> prop')
        }

        // prep container
        const container = ref<HTMLDivElement>()
        // create app
        let app: Lunch.App | null = props.appSetup(
            props.app ?? createApp(props.root!, ctx.attrs)
        )

        // get all provided values - this isn't in the types or docs, so it may be unstable
        const provides = (getCurrentInstance() as any)?.provides ?? {}
        // provide values
        Object.keys(provides).forEach((key) => {
            app?.provide(key, inject(key))
        })

        // mount
        onMounted(() => {
            app?.mount(container.value)
        })

        // unmount
        onUnmounted(() => {
            app?.unmount()
            app = null
        })

        return () => <div ref={container as any} />
    },
})
