<template>
    <Lunchbox :cameraPosition="[5, 5, 5]" :cameraLook="[0, 0, 0]">
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>
        <TransformControlsWrapper />
    </Lunchbox>
</template>

<script lang="ts" setup>
</script>