<template>
    <Lunchbox>
        <mesh position-z="-5" :rotation-x="rotation.x" :rotation-y="rotation.y">
            <boxGeometry />
            <meshBasicMaterial color="#00ff00" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onBeforeRender } from '../../src'
import { ref } from 'vue'

const rotation = ref({ x: 0, y: 0 })

onBeforeRender(() => {
    rotation.value.x += 0.01
    rotation.value.y += 0.01
})
</script>