<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="#ff00ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { useCamera, useRenderer, useScene } from '../../src'

useCamera((cam) => console.log(cam))
useRenderer((renderer) => console.log(renderer))
useScene((scene) => console.log(scene))
</script>