<template>
    <Lunchbox :updateSource="updateSource">
        <mesh
            @click="updateSource.count++"
            position-z="-5"
            :rotation-x="rotation.x"
            :rotation-y="rotation.y"
        >
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { onAfterRender } from '../..'

const rotation = ref({ x: 0, y: 0 })

const updateSource = ref({ count: 0 })

setInterval(() => {
    rotation.value.y += 0.01
}, 16.667)

onAfterRender(() => console.log('just rendered'))

console.log(
    'The cube is always rotating, but only updates its render when you click it.'
)
</script>
