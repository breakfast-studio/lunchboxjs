<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onStart } from '../../src'

onStart(({ scene }) => {
    console.log(scene?.children)
})
</script>