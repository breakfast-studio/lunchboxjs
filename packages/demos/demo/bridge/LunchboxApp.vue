<template>
    <lunchbox :cameraPosition="[5, 5, 5]" :cameraLook="[0, 0, 0]">
        <orbit autoRotate />

        <mesh>
            <boxGeometry />
            <meshBasicMaterial :color="color" />

            <mesh :scale="1.001">
                <boxGeometry />
                <meshBasicMaterial color="black" wireframe />
            </mesh>
        </mesh>

        <pointLight :position-y="5" />
        <ambientLight :intensity="0.2" />
        <gltf
            src="BoomBox.glb"
            :position-y="0.5"
            :position-x="2"
            :scale="100"
        />
    </lunchbox>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const color = inject('color')
</script>