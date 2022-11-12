<template>
    <Lunchbox
        background="white"
        :cameraPosition="[5, 5, 5]"
        :cameraLook="[0, 0, 0]"
        :shadow="{ type: PCFShadowMap }"
    >
        <!-- Lighting -->
        <ambientLight :color="ambient" />
        <pointLight
            castShadow
            :color="point"
            :intensity="0.3"
            :position="[8, 3, 5]"
            :shadow-mapSize-width="2048"
            :shadow-mapSize-height="2048"
            :shadow-camera-near="5"
            :shadow-camera-far="15"
        />

        <!-- Container -->
        <group :scale="4" :position-y="-1.5">
            <!-- floor -->
            <mesh
                receiveShadow
                :rotation-x="Math.PI * -0.5"
                @click="refreshPalette"
            >
                <planeGeometry />
                <meshStandardMaterial :color="palette[0]" />
            </mesh>
            <!-- walls -->
            <mesh
                receiveShadow
                :position="[0, 0.5, -0.5]"
                @click="refreshPalette"
            >
                <planeGeometry />
                <meshStandardMaterial :color="palette[0]" />
            </mesh>
            <mesh
                receiveShadow
                :rotation-y="Math.PI * 0.5"
                :position="[-0.5, 0.5, 0]"
                @click="refreshPalette"
            >
                <planeGeometry />
                <meshStandardMaterial :color="palette[0]" />
            </mesh>
        </group>

        <!-- Shapes -->
        <mesh
            castShadow
            receiveShadow
            v-for="(shape, i) in shapes"
            :key="i"
            :position="shape.pos.value"
            :scale="shape.scale.value"
            :rotation="shape.rot.value"
            @click="refreshPalette"
        >
            <component :is="shape.geo" />
            <meshStandardMaterial :color="shape.color.value" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { onBeforeRender } from '../../src'
import { PCFShadowMap } from 'three'
import niceColors from 'nice-color-palettes'

// constants
// ====================
const ambient = '#fdcaf5'
const point = '#ffecf7'

// rotating shapes
// ====================
const rotation = ref(0)
onBeforeRender(() => {
    rotation.value += 0.0166
    // spread.value = Math.sin(Date.now() * 0.001) * 0.4 + 1.2
    rotations.value = Math.sin(Date.now() * 0.0001) * 2 + 1
})

// breathing radius
// ====================
const spread = ref(1.4)
const rotations = ref(3)

// random shapes
// ====================
const shapeCount = 15
const palette = ref(niceColors[43])
const shapes = Array(shapeCount)
    .fill(undefined)
    .map((v, i) => {
        // geometry
        const allowedGeo = [
            'boxGeometry',
            'dodecahedronGeometry',
            'octahedronGeometry',
        ]
        const geo = allowedGeo[Math.floor(Math.random() * allowedGeo.length)]

        // position
        const pos = computed(() => [
            Math.sin((i / shapeCount) * Math.PI * 2 * rotations.value) *
                spread.value,
            (i / shapeCount) * 2,
            Math.cos((i / shapeCount) * Math.PI * 2 * rotations.value) *
                spread.value,
        ])

        // scale
        const scaleSeed = Math.random() * 0.2 + 0.2
        const scale = computed(() =>
            Math.max(Math.abs(scaleSeed * (rotations.value / 3)), 0.1)
        )

        // rotation
        const seed = Math.random()
        const allowedRotation = [
            computed(() => [
                Math.sin(rotation.value * seed),
                rotation.value * seed,
                0,
            ]),
            computed(() => [
                Math.cos(rotation.value * seed),
                Math.sin(rotation.value * seed),
                0,
            ]),
        ]
        const idx = Math.floor(Math.random() * allowedRotation.length)
        const rot = allowedRotation[idx]

        // color
        const color = computed(
            () => palette.value[(i % (palette.value.length - 2)) + 1]
        )

        return { geo, pos, scale, rot, color }
    })

const refreshPalette = () => {
    const idx = Math.floor(Math.random() * niceColors.length)
    console.log(idx)
    palette.value = niceColors[idx]
}
</script>