<template>
    <Lunchbox
        shadow
        transparent
        :cameraPosition="[5, 5, 5]"
        :cameraLook="[0, 0, 0]"
    >
        <Container />
        <Shapes />

        <pointLight castShadow :position="[0, -scale * 0.25, 0]" />
        <ambientLight color="aliceblue" intensity="0.3" />
    </Lunchbox>
</template>

<script lang="ts" setup>
import Container from './components/Container.vue'
import Shapes from './components/Shapes.vue'
import { provide } from 'vue'

const scale = 4
provide('scale', scale)
</script>