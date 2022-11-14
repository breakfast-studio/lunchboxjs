<template>
    <Lunchbox :cameraPosition="[2, 1, 3]" :cameraLook="[0, 0, 0]">
        <!-- orbit controls aren't working here because the plugin is importing from
        the built LunchboxJS, while this demo is using the dev version. TODO: fix -->
        <orbit />
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

