<template>
    <Lunchbox ref="wrapper">
        <directionalLight />
        <pointLight :position-x="2" />

        <Gltf
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
import Gltf from '../../extras/Gltf.vue'

const log = console.log
</script>