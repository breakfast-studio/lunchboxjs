<template>
    <Lunchbox background="white" :cameraPosition="[0, 0, 5]">
        <mesh :rotation-x="rotation.x" :rotation-y="rotation.y">
            <boxGeometry />
            <shaderMaterial :fragmentShader="frag" :vertexShader="vert" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onBeforeRender } from '../..'
import { ref } from 'vue'
import frag from './frag.glsl'
import vert from './vert.glsl'

const rotation = ref({ x: 0, y: 0 })

onBeforeRender(() => {
    rotation.value.x += 0.01
    rotation.value.y += 0.01
})
</script>