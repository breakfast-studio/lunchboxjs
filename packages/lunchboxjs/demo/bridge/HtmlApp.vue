<template>
    <main>
        <h1>LunchboxJS</h1>
        <lunchbox
            class="container"
            :root="LunchboxApp"
            :appSetup="appSetup"
            sizePolicy="container"
            transparent
        />

        <lunchbox
            class="container"
            :root="LunchboxApp"
            :appSetup="appSetup"
            sizePolicy="container"
            background="green"
            ortho
        />
    </main>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue'
import LunchboxApp from './LunchboxApp.vue'
import './HtmlApp.css'
import { gltf, orbit } from 'lunchboxjs-plugins'
import { Lunch } from '../../'

// injections are passed into lunchbox instances
const color = ref('green')
provide('color', color)
setTimeout(() => {
    color.value = 'dodgerblue'
}, 1000)

// add plugins to apps
const appSetup = (app: Lunch.App) => app.use(orbit).use(gltf)
</script>