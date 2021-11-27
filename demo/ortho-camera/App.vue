<template>
    <Lunchbox
        :cameraPosition="[10, 10, 10]"
        transparent
        ortho
        :cameraArgs="[-20, 20, 20, -20]"
    >
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