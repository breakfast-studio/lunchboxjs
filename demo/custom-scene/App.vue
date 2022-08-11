<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <template #scene>
            <scene v-if="sceneIndex % 2" key="blue">
                <mesh :position-x="1">
                    <boxGeometry />
                    <meshBasicMaterial color="blue" />
                </mesh>
            </scene>
            <scene v-else key="green">
                <mesh :position-x="-1">
                    <sphereGeometry />
                    <meshBasicMaterial color="green" />
                </mesh>
            </scene>
        </template>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const sceneIndex = ref(0)

setInterval(() => {
    sceneIndex.value++
    console.log(sceneIndex.value % 2)
}, 500)
</script>