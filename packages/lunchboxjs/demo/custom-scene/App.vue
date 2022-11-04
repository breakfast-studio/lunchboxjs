<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <template #scene>
            <scene key="blue">
                <mesh :position-x="1">
                    <boxGeometry />
                    <meshBasicMaterial color="blue" />
                </mesh>
            </scene>
        </template>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

// TODO: make custom scenes reactive
// const sceneIndex = ref(0)

// setInterval(() => {
//     sceneIndex.value++
//     console.log(sceneIndex.value % 2)
// }, 500)
</script>