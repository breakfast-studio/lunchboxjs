<template>
    <mesh :position="[0, 0, 0.95]" :renderOrder="2">
        <planeGeometry :args="[2, 2]" />
        <meshBasicMaterial
            :colorWrite="false"
            :depthWrite="false"
            stencilWrite
            :stencilRef="1"
            :stencilFunc="AlwaysStencilFunc"
            :stencilFail="ReplaceStencilOp"
            :stencilZFail="ReplaceStencilOp"
            :stencilZPass="ReplaceStencilOp"
        />
    </mesh>
</template>

<script lang="ts" setup>
import { AlwaysStencilFunc, ReplaceStencilOp } from 'three'
</script>