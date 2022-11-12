<template>
    <Lunchbox :cameraPosition="[-5, 2, 5]">
        <mesh @click="toggleEffects">
            <boxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>

        <OrbitControlsWrapper />
    </Lunchbox>
</template>

<script lang="ts" setup>
import { useCustomRender } from '../../src'
import OrbitControlsWrapper from '../../extras/OrbitControlsWrapper.vue'
import { Vector2 } from 'three'

// effect composer
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

let composer: EffectComposer | null = null

const { setCustomRender, clearCustomRender } = useCustomRender()

// function to add fx to scene
const addFx = () =>
    setCustomRender?.((opts) => {
        const canvas = opts.renderer?.domElement

        // ignore if no canvas
        if (!canvas || !opts.scene || !opts.camera) return

        // setup effect composer if needed
        if (!composer) {
            composer = new EffectComposer(opts.renderer as THREE.WebGLRenderer)

            const renderPass = new RenderPass(opts.scene, opts.camera)
            composer.addPass(renderPass)

            const bloomPass = new UnrealBloomPass(
                new Vector2(canvas.width, canvas.height),
                1,
                0.5,
                0
            )
            composer.addPass(bloomPass)
        }

        composer.render()
    })

addFx()

// toggle fx on and off
let fxOn = true
const toggleEffects = () => {
    if (fxOn) {
        clearCustomRender?.()
    } else {
        addFx()
    }

    fxOn = !fxOn
}
</script>