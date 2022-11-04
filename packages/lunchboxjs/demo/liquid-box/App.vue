<template>
    <Lunchbox :cameraPosition="[2, 2, 4]">
        <OrbitControlsWrapper />
        <mesh :scale="2">
            <boxGeometry :args="[1, 1, 1, 100, 100, 100]" />
            <shaderMaterial
                :args="[{ uniforms, vertexShader, fragmentShader }]"
            />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import { onBeforeRender } from '../../src'
import OrbitControlsWrapper from '../../extras/OrbitControlsWrapper.vue'
import vertexShader from './vert.vs?raw'
import fragmentShader from './frag.fs?raw'

const uniforms = reactive({
    time: { value: 1.0 },
})

const start = Date.now()

onBeforeRender(() => {
    uniforms.time.value = (Date.now() - start) * 0.001
})
</script>
