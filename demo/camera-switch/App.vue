<template>
    <Lunchbox background="white" :shadow="{ type: PCFSoftShadowMap }">
        <!-- Cameras -->
        <perspectiveCamera :position="[2, 2, 5]" v-if="cameraIndex === 0" />
        <perspectiveCamera
            :rotation-x="cameraRotation"
            :position="[-2, 1, 10]"
            v-if="cameraIndex === 1"
        />
        <perspectiveCamera :position="[2, 4, 5]" v-if="cameraIndex === 2" />

        <!-- Light -->
        <pointLight
            :position-x="1"
            :position-y="3"
            :position-z="3"
            castShadow
        />
        <ambientLight :intensity="0.1" />

        <!-- Object -->
        <mesh
            castShadow
            receiveShadow
            :scale="0.5"
            :position-y="1"
            @click="cameraIndex = (cameraIndex + 1) % cameraCount"
        >
            <torusKnotGeometry :args="[1, 0.4, 240, 20]" />
            <meshStandardMaterial />
        </mesh>

        <!-- Ground -->
        <mesh :rotation-x="Math.PI * -0.5" :scale="100" receiveShadow>
            <planeGeometry />
            <meshStandardMaterial />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { PCFSoftShadowMap } from 'three'
import { onBeforeRender } from '../../src'

const cameraCount = 3
const cameraIndex = ref(0)
const cameraRotation = ref(0)
onBeforeRender(() => {
    cameraRotation.value = Math.sin(Date.now() * 0.0001) * 0.1
})
</script>