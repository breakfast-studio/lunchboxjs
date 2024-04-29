import { defineComponent } from 'vue'

export const LunchboxScene = defineComponent({
    name: 'LunchboxScene',
    setup(props, { slots }) {
        return () => <scene>{slots.default?.()}</scene>
    },
})
