<template>
    <Lunchbox background="white" :shadow="{ type: PCFSoftShadowMap }">
        <template #camera>
            <!-- Cameras -->
            <perspectiveCamera
                ref="cam1"
                :position="[2, 1, 5]"
                v-if="cameraIndex === 0"
                key="cam1"
            />
            <perspectiveCamera
                :rotation-x="cameraRotation"
                :position="[-2, 1, 10]"
                v-else-if="cameraIndex === 1"
                key="cam2"
            />
            <perspectiveCamera
                :position="[2, 4, 5]"
                v-else-if="cameraIndex === 2"
                key="cam3"
            />
        </template>

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
import { onMounted, ref, watch } from 'vue'
import { PCFSoftShadowMap } from 'three'
import type { PerspectiveCamera } from 'three'
import { Lunch, onBeforeRender, onCameraReady } from '../..'

const cameraCount = 3
const cameraIndex = ref(0)
const cameraRotation = ref(0)
let cam: PerspectiveCamera

onBeforeRender(() => {
    cameraRotation.value = Math.sin(Date.now() * 0.0001) * 0.1
})

// onCameraReady(console.log)

// watch(cameraIndex, console.log)
</script>