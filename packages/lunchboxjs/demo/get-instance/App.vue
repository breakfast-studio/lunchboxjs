<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh ref="mesh">
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>

        <mesh :position-x="2" v-if="showMesh2">
            <boxGeometry ref="geo"/>
            <meshBasicMaterial color="#ff00ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { getInstance } from '../../src'

// mesh instance
const mesh = ref()
const instance = getInstance<THREE.Mesh>(mesh)

// geometry instance that appears after a few seconds
const geo = ref()
const instance2 = getInstance<THREE.BoxGeometry>(geo)
const showMesh2 = ref(false)
onMounted(() => {
    setTimeout(() => showMesh2.value = true, 3000)
})

// log instance updates
watch([instance, instance2], (newVal) => console.log(newVal), { immediate: true })
</script>