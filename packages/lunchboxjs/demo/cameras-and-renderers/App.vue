<template>
    <Lunchbox
        :cameraPosition="[15, 15, 15]"
        :cameraLook="[0, 0, 0]"
        background="indigo"
        orthographic
    >
        <!-- extra renderer -->
        <webGLRenderer
            :setSize="[targetSize, targetSize, true]"
            ref="rtRenderer"
            :is-default="false"
        />

        <!-- Light -->
        <!-- (2 required, one for each layer, since selective lighting
        isn't implemented in Three at time of writing) -->
        <pointLight
            v-for="i in 2"
            :key="i"
            @added="(evt) => (i === 1 ? setLayer(evt) : undefined)"
            :position="[-2, 3, 5]"
        />

        <!-- POI -->
        <mesh
            @added="toggleLayer"
            :scale="2"
            :position-z="-5"
            :rotation-z="boxY"
            ref="poi"
        >
            <torusKnotGeometry />
            <meshStandardMaterial />
        </mesh>

        <!-- LCD -->
        <group :scale="2">
            <!-- Screen -->
            <mesh :scale="6" :position-z="-0.01">
                <planeGeometry />
                <meshStandardMaterial color="#cdcbb7" />
            </mesh>

            <!-- Squares -->
            <mesh
                v-for="(v, i) in opacities"
                :key="i"
                :position-y="
                    -Math.floor(i / columns) * scale +
                    Math.ceil(count / columns) * 0.5 * scale -
                    0.5 * scale
                "
                :position-x="
                    (i % columns) * scale - columns * 0.5 * scale + 0.5 * scale
                "
                :scale="[0.9 * scale, 0.9 * scale, 0.001 * scale]"
            >
                <boxGeometry />
                <meshStandardMaterial
                    color="#393e40"
                    transparent
                    :opacity="v"
                />

                <!-- shadow -->
                <mesh
                    :scale="[1, 1, 0.9]"
                    :position-x="0.025"
                    :position-y="-0.025"
                    :position-z="-0.03"
                >
                    <boxGeometry />
                    <meshStandardMaterial color="#b5b49f" />
                </mesh>
            </mesh>
        </group>

        <!-- LCD POV -->
        <perspectiveCamera
            ref="rtCamera"
            @added="setLayer"
            :is-default="false"
            :position-z="5"
        />
    </Lunchbox>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lunch, onBeforeRender, onStart } from '../../src'
import * as THREE from 'three'
import { TransformControls } from 'three/examples/jsm/controls/TransformControls'

// ISSUES:
// * Add function calls to docs
// * Add `isDefault` to docs
// * Add ref finder (distinguish between v.$el.instance and v.instance)

// Setup
// ====================
const columns = 20
const scale = 0.25
const count = columns * columns
const opacities = ref(new Array(count).fill(undefined).map(() => 0))
const now = ref(Date.now())

// Layers
// ====================
const toggleLayer = ({ instance }: { instance: THREE.Object3D }) => {
    instance.layers.toggle(1)
}
const setLayer = ({ instance }: { instance: THREE.Object3D }) => {
    instance.layers.set(1)
}

// Secondary render
// ====================
const targetSize = columns
const rtRenderer = ref<Lunch.LunchboxComponent<THREE.WebGLRenderer>>()
const rtCamera = ref<Lunch.LunchboxComponent<THREE.PerspectiveCamera>>()

const rtImg = document.createElement('canvas')
rtImg.width = rtImg.height = targetSize
const ctx = rtImg.getContext('2d')!
document.body.appendChild(rtImg)

onBeforeRender(({ scene, renderer }) => {
    if (
        !scene ||
        !renderer ||
        !rtCamera.value?.$el.instance ||
        !rtRenderer.value?.$el.instance
    )
        return

    // render camera view
    const secondaryCameraRenderer = rtRenderer.value?.$el.instance
    secondaryCameraRenderer.render(scene, rtCamera.value.$el.instance)

    // turn camera view into pixels
    ctx.drawImage(
        secondaryCameraRenderer.domElement,
        0,
        0,
        targetSize,
        targetSize
    )
    // get pixel brightness and set as new value
    let i = 0
    for (let y = 0; y < targetSize; y++) {
        for (let x = 0; x < targetSize; x++) {
            const px = ctx.getImageData(x, y, 1, 1)
            const avg = (px.data[0] + px.data[1] + px.data[2]) / 3
            opacities.value[i++] = 1 - Math.floor((avg / 255) * 10) / 10
        }
    }

    opacities.value = [...opacities.value]
})

// Update
// ====================
const boxX = ref(0)
const boxY = ref(0)
onBeforeRender(() => {
    now.value = Date.now()

    boxX.value = Math.sin(now.value * 0.001 + 1)
    boxY.value = Math.sin(now.value * 0.001)
})

// Controls
// ====================
const poi = ref<Lunch.Node<THREE.Mesh>>()
onStart(({ camera, renderer, scene }) => {
    if (!camera || !renderer || !scene || !poi.value?.instance) return
    const c = new TransformControls(camera, renderer.domElement)
    c.attach(poi.value?.instance)
    scene.add(c)
})
</script>