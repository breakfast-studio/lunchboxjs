<template>
    <group name="panel">
        <!-- stencil -->
        <mesh :renderOrder="2" :scale="stencilScale">
            <planeGeometry />
            <meshBasicMaterial v-if="debug" key="debug" color="blue" />
            <meshBasicMaterial
                v-else
                key="stencil"
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

        <!-- outer border -->
        <mesh v-stencil.inverted :scale="1 + blackBorderSize">
            <planeGeometry />
            <meshBasicMaterial color="black" />
        </mesh>
        <!-- white border -->
        <mesh v-stencil.inverted :position-z="0.001">
            <planeGeometry />
            <meshBasicMaterial color="white" />
        </mesh>
        <!-- inner border -->
        <mesh
            v-stencil.inverted
            :scale="stencilScale + blackBorderSize"
            :position-z="0.0011"
        >
            <planeGeometry />
            <meshBasicMaterial color="black" />
        </mesh>

        <!-- panel content -->
        <slot />
    </group>
</template>

<script lang="ts" setup>
import { AlwaysStencilFunc, ReplaceStencilOp } from 'three'

const props = defineProps<{
    debug?: boolean
    blackBorderSize?: number
    borderSize?: number
    stencilRef?: number
}>()

const {
    debug = false,
    blackBorderSize = 0.015,
    borderSize = 0.07,
    stencilRef = 1,
} = props

const stencilScale = 1 - borderSize
</script>