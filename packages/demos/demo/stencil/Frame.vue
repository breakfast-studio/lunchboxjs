<template>
    <mesh :position="[0, 1, 1]">
        <RoundedBoxGeometry :args="[2.1, 0.1, 0.1]" />
        <meshStandardMaterial color="#0C1B33" />
    </mesh>
    <mesh :position="[0, -1, 1]">
        <RoundedBoxGeometry :args="[2.1, 0.1, 0.1]" />
        <meshStandardMaterial color="#0C1B33" />
    </mesh>

    <mesh :position="[1, 0, 1]" :rotation="[0, 0, Math.PI / 2]">
        <RoundedBoxGeometry :args="[2.1, 0.1, 0.1]" />
        <meshStandardMaterial color="#0C1B33" />
    </mesh>
    <mesh :position="[-1, 0, 1]" :rotation="[0, 0, Math.PI / 2]">
        <RoundedBoxGeometry :args="[2.1, 0.1, 0.1]" />
        <meshStandardMaterial color="#0C1B33" />
    </mesh>
</template>