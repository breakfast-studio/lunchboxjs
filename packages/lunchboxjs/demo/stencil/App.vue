<template>
    <Lunchbox
        :cameraPosition="[0, 0, 3]"
        :cameraLook="[0, 0, 0]"
        background="white"
        r3f
    >
        <OrbitControlsWrapper />
        <!-- lighting -->
        <directionalLight :position="[1, 2, 1.5]" :intensity="1" />
        <ambientLight :intensity="0.4" />

        <!-- plane mask -->
        <Frame />
        <PlaneMask />

        <!-- car -->
        <Car />

        <!-- boxes -->
        <SceneProp
            color="#EAC435"
            :boxArgs="[1, 5, 1]"
            :rotation-y="Math.PI / 4"
            :position="[0, 0, -2]"
        />
        <SceneProp
            color="#03CEA4"
            :boxArgs="[2, 2, 2]"
            :position="[-2, 0, -2]"
        />
        <SceneProp
            color="#FB4D3D"
            :boxArgs="[2, 2, 2]"
            :position="[2, 0, -2]"
        />
    </Lunchbox>
</template>

<script lang="ts" setup>
// version of https://twitter.com/PFarnach/status/1527502263471718402
import SceneProp from './SceneProp.vue'
import Car from './Car.vue'
import PlaneMask from './PlaneMask.vue'
import Frame from './Frame.vue'
import OrbitControlsWrapper from '../../extras/OrbitControlsWrapper.vue'
</script>