import { defineComponent, ref } from 'vue'
import type { Lunch } from 'lunchboxjs'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'

export const GltfWrapper = defineComponent({
    name: 'Gltf',
    props: {
        preventAdd: {
            type: Boolean,
            default: false,
        },
        src: {
            type: String,
            required: true,
        },
    },
    emits: {
        error: (evt: ErrorEvent) => true,
        load: (gltf: GLTF) => true,
        progress: (evt: ProgressEvent) => true,
    },
    setup(props, { emit }) {
        const container = ref<Lunch.LunchboxComponent<THREE.Group>>()
        const onLoad = (gltf: GLTF) => {
            if (!props.preventAdd) {
                container.value?.$el?.instance?.add(gltf.scene)
            }
            emit('load', gltf)
        }
        const onProgress = (evt: ProgressEvent) => {
            emit('progress', evt)
        }
        const onError = (evt: ErrorEvent) => emit('error', evt)

        // Render
        // ====================
        return () => (
            <group ref={container}>
                <gltfLoader load={[props.src, onLoad, onProgress, onError]} />
            </group>
        )
    },
})
