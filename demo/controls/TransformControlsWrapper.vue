<template>
    <group v-if="ready">
        <TransformControls />
    </group>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { onBeforeRender, useCamera, useRenderer } from '../../src'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

// props
const props = defineProps<{
    options?: object
}>()

const ready = computed(() => {
    return useCamera().value !== null && useRenderer().value?.domElement
})
const controlsArgs = computed(() => [
    useCamera().value,
    useRenderer().value?.domElement,
])

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
