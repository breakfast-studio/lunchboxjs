<template>
    <Lunchbox :cameraPosition="[5, 5, 5]" transparent ortho>
        <mesh @click="sceneIndex = 1">
            <boxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { camera } from '../../src'

watch(
    camera,
    (v) => {
        if (!v) return
        v.lookAt(0, 0, 0)
    },
    { immediate: true }
)
</script>