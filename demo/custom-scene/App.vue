<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <scene v-if="sceneIndex === 0">
            <mesh :position-x="1" @click="sceneIndex = 1">
                <boxGeometry />
                <meshBasicMaterial color="blue" />
            </mesh>
        </scene>

        <scene v-else>
            <mesh :position-x="-1" @click="sceneIndex = 0">
                <sphereGeometry />
                <meshBasicMaterial color="green" />
            </mesh>
        </scene>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useScene } from '../../src'

const sceneIndex = ref(0)
useScene(console.log)
</script>