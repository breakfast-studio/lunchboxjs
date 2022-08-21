<template>
    <OrbitControls
        ref="controls"
        v-if="ready"
        :args="orbitArgs"
        :autoRotate="false"
        :enableDamping="true"
        :dampingFactor="0.1"
        v-bind="props.options ?? {}"
    />
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onBeforeRender, Lunch, useCamera, useRenderer } from '../src'

// props
const props = defineProps<{
    options?: object
}>()

// computed
const ready = computed(() => {
    return camera.value !== null && renderer.value.domElement
})
const camera = useCamera()
const renderer = useRenderer()
const orbitArgs = computed(() => [camera.value, renderer.value?.domElement])

// update
const controls = ref<Lunch.LunchboxComponent>()
const update = () => {
    const instance = controls.value?.$el.instance as any
    if (instance && ready.value) {
        instance.update()
    }
}
onBeforeRender(update)
</script>
