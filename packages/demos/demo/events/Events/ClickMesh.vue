<template>
    <mesh
        @pointer-enter="hovering = true"
        @pointer-leave="hovering = false"
        @click="scale = scale === 1 ? 2 : 1"
        :scale="scale"
        :rotation="[0, Math.PI * 0.25, Math.PI * 0.25]"
        :position-x="x"
    >
        <boxGeometry />
        <meshStandardMaterial :color="hovering ? 'red' : 'gray'" />
    </mesh>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        x: { type: Number },
    },
    data() {
        return {
            hovering: false,
            scale: 1,
        }
    },
})
</script>