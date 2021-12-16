<template>
    <group>
        <mesh
            v-for="(shape, i) in shapes"
            :key="i"
            :position="shape.position"
            :scale="shape.scale"
            castShadow
            receiveShadow
        >
            <component :is="`${shape.geometry}Geometry`" />
            <meshStandardMaterial />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import * as CANNON from 'cannon-es'
import { onBeforeRender } from '../../../src'
import { inject, ref } from 'vue'

const scale = inject<number>('scale')!

type ShapeGeometry = 'sphere'
interface ShapeMeta {
    body: CANNON.Body
    geometry: ShapeGeometry
    position: [number, number, number]
    scale: number
}

// create world
// ====================
const world = new CANNON.World()
// world update
let lastTime = new Date().getTime() * 0.001
const update = () => {
    const t = new Date().getTime() * 0.001
    world.step(1 / 60, t - lastTime)
    lastTime = t

    // copy shape data to make reactive
    shapes.value.forEach((v) => {
        v.position = [v.body.position.x, v.body.position.y, v.body.position.z]
    })
}
// add update function
onBeforeRender(update)

const shapes = ref([] as ShapeMeta[])

// add bounds
// ====================
const ground = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Plane(),
})
ground.position.y = -scale * 0.5
// face up
ground.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0)
world.addBody(ground)

// add shapes
// ====================
const addShape = (
    position: [number, number, number] = [0, 2, 0],
    geometry: ShapeGeometry = 'sphere',
    radius: number = 0.2
) => {
    let shape: CANNON.Shape
    switch (geometry) {
        case 'sphere':
            shape = new CANNON.Sphere(radius)
            break
    }

    const sphereBody = new CANNON.Body({
        mass: 5, // kg
        shape,
    })
    sphereBody.position.set(...position) // m

    shapes.value.push({
        body: sphereBody,
        geometry,
        position,
        scale: radius,
    })
    world.addBody(sphereBody)
    // nudge
    sphereBody.applyForce(
        new CANNON.Vec3(
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            Math.random() * 100 - 50
        )
    )
}
addShape()
addShape([0, 3, -0.1])
</script>