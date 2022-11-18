<template>
    <Lunchbox ref="wrapper">
        <directionalLight />
        <pointLight :position-x="2" />

        <gltf
            src="/gltf/BoomBox.glb"
            @progress="log"
            @load="log"
            @error="log"
            :position-z="-4"
            :scale="100"
        />
    </Lunchbox>
</template>

<script lang="ts" setup>
const log = console.log
</script>