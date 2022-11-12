<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="#ff00ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onCameraReady, onRendererReady, onSceneReady } from '../../src'

onCameraReady((cam) => console.log(cam))
onRendererReady((renderer) => console.log(renderer))
onSceneReady((scene) => console.log(scene))
</script>