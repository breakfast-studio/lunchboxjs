<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh @click="onClickLeft" position-x="-1">
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>

        <mesh @click="onClickRight" position-x="1">
            <boxGeometry />
            <meshBasicMaterial color="#00ff00" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import {
    offAfterRender,
    offBeforeRender,
    onAfterRender,
    onBeforeRender,
} from '../../src/'

onMounted(() => {
    alert('Open the console to see before/after render events.')
})

const beforeLog = () => console.log('Before render (click left box to toggle)')

// Before render
// ====================
onBeforeRender(beforeLog)

let beforeRunning = true
const onClickLeft = () => {
    if (beforeRunning) {
        offBeforeRender(beforeLog)
    } else {
        onBeforeRender(beforeLog)
    }

    beforeRunning = !beforeRunning
}

// After render
// ====================
const afterLog = () => console.log('After render (click right box to toggle)')

let afterRunning = false
const onClickRight = () => {
    if (afterRunning) {
        offBeforeRender(afterLog)
    } else {
        onBeforeRender(afterLog)
    }

    afterRunning = !afterRunning
}
</script>