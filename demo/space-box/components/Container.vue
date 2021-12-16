<template>
    <mesh :scale="5">
        <boxGeometry />
        <!-- TODO: parallaxed uv, space material -->
        <meshStandardMaterial color="blue" :side="BackSide" />

        <pointLight />
    </mesh>
</template>

<script lang="ts" setup>
import { BackSide } from 'three'
</script>