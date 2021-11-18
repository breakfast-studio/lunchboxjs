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
import { onBeforeRender, globals, Lunchbox } from '../src'

// props
const props = defineProps<{
    options?: object
}>()

// computed
const camera = globals.camera
const renderer = globals.renderer
const ready = computed(() => {
    return camera.value !== null && renderer.value?.instance?.domElement
})
const orbitArgs = computed(() => [
    camera.value?.instance,
    renderer.value?.instance?.domElement,
])

// update
const controls = ref<Lunchbox.LunchboxComponent>()
const update = () => {
    const instance = controls.value?.$el.instance as any
    if (instance && ready.value) {
        instance.update()
    }
}
onBeforeRender(update)
</script>
