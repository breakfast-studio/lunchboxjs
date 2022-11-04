<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <mesh
            :traverse="[onTraverse]"
            :onBeforeRender="beforeRender"
            :onAfterRender="afterRender"
        >
            <boxGeometry />
            <meshBasicMaterial color="#0000ff" />

            <mesh :position-x="2">
                <boxGeometry />
                <meshBasicMaterial color="#00ff00" />
            </mesh>
        </mesh>
    </Lunchbox>
</template>

<script lang="ts" setup>
const onTraverse = (v: any) => {
    console.log('traverse:', v)
}

// built-in ThreeJS before/after render functions
const beforeRender = () => {
    console.log('before render')
}

const afterRender = () => {
    console.log('after render')
}
</script>