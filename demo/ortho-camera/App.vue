<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <orthographicCamera />
        <mesh @click="sceneIndex = 1">
            <boxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
</script>