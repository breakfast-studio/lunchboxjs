<template>
    <Lunchbox
        shadow
        transparent
        :cameraPosition="[5, 5, 5]"
        :cameraLook="[0, 0, 0]"
    >
        <Container />
        <Shapes />
    </Lunchbox>
</template>

<script lang="ts" setup>
import Container from './components/Container.vue'
import Shapes from './components/Shapes.vue'
import { provide } from 'vue'

provide('scale', 5)
</script>