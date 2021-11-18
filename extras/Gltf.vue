<template>
    <group ref="container">
        <gltfLoader :load="[props.src, onLoad, onProgress, onError]" />
    </group>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { Lunchbox } from '../src'

const props = defineProps<{
    preventAdd?: boolean
    src: string
}>()

const emit = defineEmits<{
    (e: 'load', gltf: GLTF): void
    (e: 'progress', evt: ProgressEvent): void
    (e: 'error', evt: ErrorEvent): void
}>()

const container = ref<Lunchbox.LunchboxComponent<THREE.Group>>()
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
</script>