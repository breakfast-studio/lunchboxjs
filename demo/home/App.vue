<template>
    <main class="home">
        <h1>Lunchbox V2</h1>
        <ul>
            <li class="single-demo" v-for="(item, i) in demos" :key="i">
                <a
                    :href="
                        item.url ??
                        `/demo/${item.title[0].toLowerCase()}${item.title.slice(
                            1
                        )}/`
                    "
                    >{{ item.title }}</a
                >
            </li>
        </ul>
    </main>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const demos = ref([
    { title: 'Hierarchy' },
    { title: 'Events' },
    { title: 'Loader' },
    { title: 'Gltf' },
    { title: 'Liquid Box', url: '/demo/liquid-box/' },
    { title: 'Basic' },
    { title: 'Shadows' },
    { title: 'Custom Shader', url: '/demo/custom-shader/' },
    { title: 'Custom Scene', url: '/demo/custom-scene/' },
    { title: 'Camera Switch', url: '/demo/camera-switch/' },
    { title: 'Custom Render', url: '/demo/custom-render/' },
    { title: 'Orthographic Camera', url: '/demo/ortho-camera/' },
])
</script>