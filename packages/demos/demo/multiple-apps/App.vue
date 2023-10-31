<template>
    <Lunchbox background="#ff00ff" sizePolicy="container">
        <mesh position-z="-5" :rotation-x="rotation.x" :rotation-y="rotation.y">
            <boxGeometry />
            <meshBasicMaterial color="#ffff00" />

            <mesh :scale="1.001">
                <boxGeometry />
                <meshBasicMaterial color="black" wireframe />
            </mesh>
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onBeforeRender } from '../..'
import { ref } from 'vue'

const rotation = ref({ x: 0, y: 0 })

onBeforeRender(({ renderer }) => {
    rotation.value.x += 0.01
    rotation.value.y += 0.01
})
</script>