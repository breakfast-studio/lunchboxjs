<template>
    <section class="wrapper">
        <div style="height: 50vh" id="app1" />
        <div style="height: 50vh" id="app2" />
    </section>
</template>

<script lang="ts" setup>
import { createApp } from '../../src'
import { onMounted } from 'vue'
import Basic from './Basic.vue'

const app1 = createApp(Basic)
const app2 = createApp(Basic)

onMounted(() => {
    app1.mount('#app1')
    app2.mount('#app2')
})

</script>

<style>
html, body {
    padding: 0;
    margin: 0;
}
</style>