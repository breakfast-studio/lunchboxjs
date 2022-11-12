<template>
    <Lunchbox :cameraPosition="[5, 5, 5]" :cameraLook="[0, 0, 0]">
        <mesh ref="mesh">
            <boxGeometry />
            <meshBasicMaterial color="#cccccc" />
        </mesh>
        <TransformControlsWrapper
            ref="transformControls"
            v-if="mesh"
            :attachTo="mesh.instance"
        />
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity'

const mesh = ref()
</script>