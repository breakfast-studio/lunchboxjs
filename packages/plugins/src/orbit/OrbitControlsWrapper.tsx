import { computed, defineComponent, ref } from 'vue'
import { onBeforeRender, Lunch, useCamera, useRenderer } from 'lunchboxjs'

export const OrbitControlsWrapper = defineComponent({
    name: 'OrbitControlsWrapper',
    setup() {
        // computed
        const ready = computed(() => {
            return camera.value !== null && renderer.value.domElement
        })
        const camera = useCamera()
        const renderer = useRenderer()
        const orbitArgs = computed(() => [
            camera.value,
            renderer.value?.domElement,
        ])

        // update
        const controls = ref<Lunch.LunchboxComponent>()
        const update = () => {
            const instance = controls.value?.$el.instance as any
            if (instance && ready.value) {
                instance.update()
            }
        }
        onBeforeRender(update)

        return () =>
            ready.value && (
                <orbitControls
                    ref={controls}
                    args={orbitArgs.value}
                    autoRotate={false}
                    enableDamping={true}
                    dampingFactor={0.1}
                />
            )
    },
})
