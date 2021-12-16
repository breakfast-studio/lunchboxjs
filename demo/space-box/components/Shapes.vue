<template>
    <group>
        <mesh
            v-for="(shape, i) in shapes"
            :key="i"
            :position="shape.position"
            :scale="shape.scale"
            castShadow
            receiveShadow
            @click="($event) => impulse($event, i)"
            :quaternion="shape.quaternion"
        >
            <component :is="`${shape.geometry}Geometry`" />
            <meshStandardMaterial :color="palette[i % palette.length]" />
        </mesh>
    </group>
</template>

<script lang="ts" setup>
import * as CANNON from 'cannon-es'
import { onBeforeRender } from '../../../src'
import { computed, inject, ref } from 'vue'
import { addBounds } from './addBounds'
import * as THREE from 'three'
import palettes from 'nice-color-palettes'

const paletteIdx = ref(0)
const palette = computed(() => palettes[paletteIdx.value % palettes.length])

// Meta
// ====================
const scale = inject<number>('scale')!

// Types
// ====================
type ShapeGeometry = 'sphere' | 'box'
interface ShapeMeta {
    geometry: ShapeGeometry
    position: [number, number, number]
    quaternion: [number, number, number, number]
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
    shapes.value.forEach((v, i) => {
        v.position = [
            bodies[i].position.x,
            bodies[i].position.y,
            bodies[i].position.z,
        ]
        v.quaternion = [
            bodies[i].quaternion.x,
            bodies[i].quaternion.y,
            bodies[i].quaternion.z,
            bodies[i].quaternion.w,
        ]
    })
}
// add update function
onBeforeRender(update)

const shapes = ref([] as ShapeMeta[])

// add bounds
// ====================
const walls = addBounds(scale, world)

const material = new CANNON.Material({ restitution: 0.7, friction: 0 })

// impulse on click
// ====================
let lock = false
const impulse = (
    { intersection }: { intersection: THREE.Intersection<THREE.Mesh> },
    index: number
) => {
    if (lock) return
    lock = true
    setTimeout(() => (lock = false), 100)

    paletteIdx.value++

    const normal = intersection.face?.normal.normalize()
    normal?.multiplyScalar(-50)
    if (normal) {
        const force = new CANNON.Vec3(normal.x, normal.y, normal.z)
        bodies[index].applyLocalImpulse(force)
    }
}

// add shapes
// ====================
const bodies: CANNON.Body[] = []
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
        case 'box':
            shape = new CANNON.Box(new CANNON.Vec3(radius, radius, radius))
            break
    }

    const sphereBody = new CANNON.Body({
        mass: 5, // kg
        shape,
        material,
    })
    sphereBody.position.set(...position) // m

    shapes.value.push({
        geometry,
        position,
        scale: radius,
        quaternion: [0, 0, 0, 0],
    })
    bodies.push(sphereBody)
    world.addBody(sphereBody)
    sphereBody.applyLocalImpulse(
        new CANNON.Vec3(
            Math.random() * -0.5 * 10,
            Math.random() * -0.5 * 10,
            Math.random() * -0.5 * 10
        )
    )
}

const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

const spawn = async () => {
    for (let i = 0; i < 100; i++) {
        const allowedShapes: ShapeGeometry[] = ['sphere', 'box']
        const shape =
            allowedShapes[Math.floor(Math.random() * allowedShapes.length)]

        addShape(
            [
                Math.random() * scale - scale * 0.5,
                Math.random() * scale - scale * 0.5,
                Math.random() * scale - scale * 0.5,
            ],
            shape,
            Math.random() * 0.05 + 0.05
        )

        await wait(100)
    }
}
spawn()
</script>