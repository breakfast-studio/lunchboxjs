<template>
    <Lunchbox transparent :cameraPosition="[5, 5, 5]" :cameraLook="[0, 0, 0]">
        <Container />
    </Lunchbox>
</template>

<script lang="ts" setup>
import Container from './components/Container.vue'
</script>