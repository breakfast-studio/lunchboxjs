<template>
    <Lunchbox :cameraPosition="[0, 0, 8]" :shadow="{ type: PCFSoftShadowMap }">
        <pointLight
            :position-x="x"
            :position-y="3"
            :position-z="3"
            castShadow
        />

        <mesh castShadow receiveShadow>
            <torusKnotGeometry :args="[1, 0.4, 240, 20]" />
            <meshStandardMaterial color="blue" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onBeforeRender } from '../..'
import { ref } from 'vue'
import { PCFSoftShadowMap } from 'three'

const x = ref(3)

onBeforeRender(() => {
    x.value = Math.sin(Date.now() * 0.001) * 3
})
</script>