<template>
    <mesh :scale="scale" receiveShadow>
        <boxGeometry />
        <!-- TODO: parallaxed uv, space material -->
        <meshStandardMaterial
            color="blue"
            :side="BackSide"
            :transmission="0.8"
            transparent
        />
    </mesh>
</template>

<script lang="ts" setup>
import { BackSide } from 'three'
import { inject } from 'vue'

const scale = inject<number>('scale')!
</script>