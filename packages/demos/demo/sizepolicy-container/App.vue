<template>
    <section id="lunchbox-app"></section>
</template>

<script lang="ts" setup>
import { createApp } from '../..'
import { onMounted } from 'vue'
import Basic from './Basic.vue'

const app = createApp(Basic)

onMounted(() => {
    app.mount('#lunchbox-app')
})
</script>

<style>
#lunchbox-app {
    padding: 50px;
}
</style>