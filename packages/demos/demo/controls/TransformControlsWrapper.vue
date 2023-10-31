<template>
    <TransformControls @added="onAdded" v-if="ready" :args="controlsArgs" />
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useCamera, useRenderer } from '../..'

// props
const props = defineProps<{
    attachTo?: object
}>()

const ready = computed(() => {
    return useCamera().value !== null && useRenderer().value?.domElement
})
const controlsArgs = computed(() => [
    useCamera().value,
    useRenderer().value?.domElement,
])

const onAdded = ({ instance }: any) => {
    instance.attach(props.attachTo)
}
</script>
