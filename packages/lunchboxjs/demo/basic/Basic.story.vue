<script setup lang="ts">
import { onBeforeRender } from '../../src'
import { ref } from 'vue'

/* function mySetupApp ({ app, story, variant }) {
  console.log('mySetupApp', { app, story, variant })
} */

const rotation = ref({ x: 0, y: 0 })

onBeforeRender(() => {
    rotation.value.x += 0.01
    rotation.value.y += 0.01
})
</script>


<template>
  <Story title="Basic">
    <Variant title="playground">
      <div id="lunchbox-story">
        <Lunchbox>
            <mesh position-z="-5" :rotation-x="rotation.x" :rotation-y="rotation.y">
                <boxGeometry />
                <meshBasicMaterial color="#00ff00" />
            </mesh>
        </Lunchbox>
      </div>  
    </Variant>
  </Story>
</template>
