<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh>
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import { onMounted, watch } from 'vue'
import { useGlobals, useUpdateGlobals } from '../../src'

const globals = useGlobals()
const updateGlobals = useUpdateGlobals()

watch(globals, (v) => console.log('dpr set to', v.dpr), { immediate: true })

onMounted(() => {
    setTimeout(() => {
        updateGlobals({ dpr: 2 })
    }, 1000)
})
</script>