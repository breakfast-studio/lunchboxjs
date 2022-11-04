<template>
    <Lunchbox
        :cameraLook="[0, 0, 0]"
        :cameraPosition="[5, 5, 5]"
        transparent
        ortho
        :zoom="2"
    >
        <mesh @click="sceneIndex = 1">
            <boxGeometry />
            <meshBasicMaterial color="blue" />
        </mesh>
    </Lunchbox>
</template>