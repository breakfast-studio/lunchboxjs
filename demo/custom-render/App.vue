<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh @click="sceneIndex = 1">
            <boxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>

        <scene v-if="sceneIndex === 1">
            <mesh @click="sceneIndex = 0">
                <sphereGeometry />
                <meshBasicMaterial color="green" />
            </mesh>
        </scene>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const sceneIndex = ref(0)
</script>