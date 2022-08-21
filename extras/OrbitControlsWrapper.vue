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
import { computed, ref, watch } from 'vue'
import {
    onBeforeRender,
    Lunch,
    // camera,
    camera,
    renderer,
} from '../src'

// props
const props = defineProps<{
    options?: object
}>()

// computed
const ready = computed(() => {
    return cam.value !== null && r.value.domElement
})
const cam = camera()
const r = renderer()
const orbitArgs = computed(() => [cam.value, r.value?.domElement])
// watch(() => orbitArgs.value, console.log, { immediate: true })
// console.log(renderer)
watch(camera, console.log)

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
