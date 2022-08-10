<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <!-- <template #renderer>
            <webGLRenderer ref="r" />
        </template> -->

        <mesh :rotation-y="rotation">
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { ref } from '@vue/reactivity'
import { watch } from 'vue'
import * as THREE from 'three'
import { Lunch, useCamera, useScene } from '../../src'

const r = ref<Lunch.LunchboxComponent<THREE.Renderer>>()
let renderer: THREE.Renderer

let camera: THREE.Camera, scene: THREE.Scene

useCamera((c) => (camera = c))
useScene((s) => (scene = s))

const rotation = ref(0)
setInterval(() => {
    rotation.value -= 0.01666
}, 16)

watch(
    r,
    () => {
        if (renderer) return

        renderer = r.value?.$el.instance as any
        if (!renderer) return

        // append canvas
        const canvas = r.value?.$el.instance?.domElement
        if (canvas) {
            document.body.appendChild(canvas)
        }

        // start render loop
        const update = () => {
            if (scene && camera) {
                renderer.render(scene, camera)
            } else {
                console.log(scene, camera)
            }
            requestAnimationFrame(update)
        }
        update()
    },
    { immediate: true }
)
</script>