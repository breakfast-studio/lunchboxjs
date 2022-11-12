<template>
    <group>
        <ClickMesh :x="-props.spread" />
        <ClickMesh :x="props.spread" />
    </group>
</template>

<script lang="ts" setup>
import { defineComponent, withDefaults } from 'vue'
import ClickMesh from './ClickMesh.vue'

const props = withDefaults(
    defineProps<{
        spread?: number
    }>(),
    { spread: 3 }
)
</script>
