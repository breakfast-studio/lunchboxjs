<template>
    <Lunchbox background="#50bffc" :cameraPosition="[0, 0, 5]">
        <Panel>
            <mesh v-stencil :scale="0.5" :position-z="-1">
                <boxGeometry />
                <meshStandardMaterial color="tomato" />
            </mesh>

            <pointLight :position="[0, 5, 5]" />
        </Panel>

        <Panel :position-x="1.1">
            <mesh :scale="0.5" :position-z="-1">
                <boxGeometry />
                <meshStandardMaterial color="tomato" />
            </mesh>
        </Panel>
    </Lunchbox>
</template>

<script lang="ts" setup>
import Panel from './Panel.vue'
import { ref } from 'vue'
import { onBeforeRender, useCamera } from '../../'
import * as THREE from 'three'

const camera = useCamera()

const now = ref(Date.now() * 0.005)
onBeforeRender(() => {
    now.value = Date.now() * 0.005

    if (camera.value) {
        camera.value.position.x = Math.sin(now.value * 0.2) * 3
        camera.value.lookAt(0, 0, 0)
    }
})
</script>