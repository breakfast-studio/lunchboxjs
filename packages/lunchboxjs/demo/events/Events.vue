<template>
    <Lunchbox transparent :cameraPosition="[0, 0, 10]">
        <!-- <OrbitControlsWrapper /> -->
        <pointLight :position="[0, 50, 50]" />
        <EventComponent />
    </Lunchbox>
</template>

<script lang="ts" setup>
// import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import EventComponent from './Events/EventComponent.vue'
</script>
