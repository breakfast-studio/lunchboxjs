<template>
    <mesh :scale="scale" receiveShadow>
        <boxGeometry />
        <!-- TODO: parallaxed uv, space material -->
        <meshStandardMaterial color="blue" :side="BackSide" />

        <pointLight castShadow :position="[0.5, 0.5, 0]" />
    </mesh>
</template>

<script lang="ts" setup>
import { BackSide } from 'three'
import { inject } from 'vue'

const scale = inject<number>('scale')!
</script>