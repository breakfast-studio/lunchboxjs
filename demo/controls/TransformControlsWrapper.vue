<template>
    <group v-if="ready">
        <TransformControls />
    </group>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onBeforeRender, globals, Lunch, camera, renderer } from '../../src'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

// props
const props = defineProps<{
    options?: object
}>()

const ready = computed(() => {
    return camera.value !== null && renderer.value?.domElement
})
const controlsArgs = computed(() => [camera.value, renderer.value?.domElement])

// update
let added = false
const controls = ref<any>() //<Lunch.LunchboxComponent<TransformControls>>()
onBeforeRender(({ scene }) => {
    const instance = controls.value?.$el.instance as any
    if (instance && ready.value) {
        instance.update()
    }
})
</script>
