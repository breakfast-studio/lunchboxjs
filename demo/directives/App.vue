<template>
    <Lunchbox
        background="#50bffc"
        :cameraPosition="[-1.5, 0.5, 5]"
        :cameraLook="[0, 0, 0]"
    >
        <pointLight :position="[0, 5, 5]" />

        <group :position-x="-0.55">
            <Panel>
                <mesh
                    :v-stencil="{ stencilRef: 3 }"
                    :scale="0.5"
                    :position-z="-1"
                >
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />
                </mesh>
            </Panel>

            <Panel :position-x="1.1">
                <mesh v-stencil :scale="0.5" :position-z="-1">
                    <boxGeometry />
                    <meshStandardMaterial color="tomato" />
                </mesh>
            </Panel>
        </group>
    </Lunchbox>
</template>

<script lang="ts" setup>
import Panel from './Panel.vue'
</script>