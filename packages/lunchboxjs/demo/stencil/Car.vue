<template>
    <group
        :position-x="Math.sin(now) * 1"
        :position-y="Math.cos(now) * 1"
        :rotation-x="now"
        :rotation-y="now * 0.5"
    >
        <mesh :renderOrder="2" :scale="0.5" @click="inverted = !inverted">
            <torusKnotGeometry />
            <meshToonMaterial
                color="#008cc5"
                stencilWrite
                :stencilRef="1"
                :stencilFunc="inverted ? NotEqualStencilFunc : EqualStencilFunc"
                :stencilFail="KeepStencilOp"
                :stencilZFail="KeepStencilOp"
                :stencilZPass="KeepStencilOp"
            />
        </mesh>
        <mesh :renderOrder="2" :scale="0.5">
            <torusKnotGeometry />
            <meshBasicMaterial
                color="black"
                wireframe
                stencilWrite
                :stencilRef="1"
                :stencilFunc="inverted ? NotEqualStencilFunc : EqualStencilFunc"
                :stencilFail="KeepStencilOp"
                :stencilZFail="KeepStencilOp"
                :stencilZPass="KeepStencilOp"
            />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import { onBeforeRender } from '../../src'
import { onMounted, ref } from 'vue'
import { EqualStencilFunc, NotEqualStencilFunc, KeepStencilOp } from 'three'

const inverted = ref(false)

const now = ref(Date.now() * 0.001)
onBeforeRender(() => {
    now.value = Date.now() * 0.001
    // x.value = Math.sin(now) * 0.5
    // y.value = Math.cos(now) * 0.5
})
</script>