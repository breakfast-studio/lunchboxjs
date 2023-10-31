<template>
    <Lunchbox :updateSource="rotation">
        <mesh
            @click="changeState"
            position-z="-5"
            :rotation-x="rotation.x"
            :rotation-y="rotation.y"
        >
            <boxGeometry />
            <meshBasicMaterial color="#00ff00" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onAfterRender } from '../..'
import { ref } from 'vue'

const rotation = ref({ x: 0, y: 0 })

const changeState = () => {
    rotation.value.x += 0.1
    rotation.value.y += 0.1
}

onAfterRender(() => {
    // you will only see this message when a new frame is rendered
    const stateStr = `[${rotation.value.x.toFixed(
        1
    )}, ${rotation.value.y.toFixed(1)}]`
    console.log(`render (state: ${stateStr})`)
})
</script>
