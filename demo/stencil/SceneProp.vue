<template>
    <mesh>
        <RoundedBoxGeometry :args="boxArgs" />
        <meshPhongMaterial :color="color" />
    </mesh>
</template>

<script lang="ts" setup>
const { color, boxArgs } = defineProps<{
    color: string
    boxArgs: Record<string, any>
}>()
</script>