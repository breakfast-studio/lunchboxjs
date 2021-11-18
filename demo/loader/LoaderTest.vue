<template>
    <Lunchbox :cameraPosition="[2, 1, 3]">
        <OrbitControlsWrapper :autoRotate="false" />
        <ambientLight :intensity="0.2" />
        <directionalLight :position-y="10">
            <object3D attach="target" :position-x="-0.1" :position-y="-0.1" />
        </directionalLight>

        <mesh>
            <icosahedronGeometry :args="[1, 10]" />
            <meshStandardMaterial>
                <textureLoader src="/loader/diffuse.jpg" attach="map" />
                <textureLoader src="/loader/normal.jpg" attach="normalMap" />
                <textureLoader
                    src="/loader/roughness.jpg"
                    attach="roughnessMap"
                />
            </meshStandardMaterial>
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
import OrbitControlsWrapper from '../../extras/OrbitControlsWrapper.vue'
</script>