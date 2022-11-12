<template>
    <Lunchbox ref="wrapper" background="#333">
        <mesh :position-z="-8" ref="parent">
            <meshBasicMaterial wireframe color="white" />
            <boxGeometry />

            <mesh
                :scale="0.5"
                :position-y="1.5"
                ref="child"
                v-if="childVisible"
                uuid="CHILD"
            >
                <meshBasicMaterial transparent color="red" wireframe />
                <boxGeometry />
            </mesh>
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
/*

*/
// import OrbitControlsWrapper from '../../src/examples/OrbitControlsWrapper.vue'
import { onMounted, ref } from 'vue'
import { Lunch } from '../../src'
import * as THREE from 'three'
//:cameraPosition="[2, 2, 5]"
// setup
const childVisible = ref(false)
const parent = ref<Lunch.Node>()
const child = ref<Lunch.Node>()
const wrapper = ref<Lunch.Node>()
const isPresent = ref(false)
// mount
onMounted(() => {
    // console.log(parent.value)
    // update()
    // console.log(lunchboxTree)
    //
    // setInterval(() => {
    //     isPresent.value = !isPresent.value
    // }, 500)
    setInterval(() => {
        childVisible.value = !childVisible.value
        // console.log(ensureRootNode())
        // console.log(childVisible.value)
    }, 1000)
    // setTimeout(() => (childVisible.value = !childVisible.value), 2000)
    // const scene = ensureScene()
    // const box = new THREE.Mesh(
    //     new THREE.BoxBufferGeometry(),
    //     new THREE.MeshBasicMaterial({ color: 'blue' })
    // )
    // box.name = 'ZZZ'
    // box.position.z = -4
    // scene.instance?.add?.(box)
    // console.log(scene)
})

// UPDATE
// ====================
const update = () => {
    requestAnimationFrame(update)

    const newX = Math.sin(Date.now() * 0.001)
    // console.log(parent, child)

    if (parent.value?.instance) {
        parent.value.instance.position.x = newX
    }
    if (child.value?.instance) {
        child.value.instance.position.x = newX
        child.value.instance.position.y = Math.cos(Date.now() * 0.001)
    }
}
update()
</script>