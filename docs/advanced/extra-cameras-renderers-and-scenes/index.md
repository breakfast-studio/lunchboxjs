# Extra Cameras, Renderers and Scenes

:::tip TL;DR
Use the `is-default` prop to specify secondary cameras, renderers, or scenes:

```html
<perspectiveCamera :is-default="false" />
```

:::

Sometimes you'll need extra core features like cameras, renderers, and scenes. You can add one or more of these components to your app, but by default they'll become the current Lunchbox camera, renderer, or scene:

```html
<template>
    <Lunchbox :cameraPosition="[0, 0, 5]">
        <perspectiveCamera ref="cam">
    </Lunchbox>
</template>

<script setup>
import { onMounted } from 'vue'

// `cam` is now the default Lunchbox camera
const cam = ref()

onMounted(() => {
    // === 5, since the `cameraPosition` prop moves the default camera
    console.log(cam.value.position.z)
})
</script>
```

There are some scenarios where this isn't desired - for example, this app ([source](https://github.com/breakfast-studio/lcd-camera)) needs a secondary camera to capture the rotating shape, but we still want to keep the main camera for ease of use:

<div style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%;">
    <iframe style="border: none; position: absolute; top: 0; left: 0; width: 100%; height: 100%;" src="https://lcd-camera.netlify.app/"/>
</div>

In that case, you can add the `is-default` prop to specify whether a camera, scene, or renderer should become the Lunchbox default or not:

```html
<webGLRenderer ref="myRenderer" :is-default="false" />
<perspectiveCamera ref="myCamera" :is-default="false" :position-z="5" />
```

From there you have full access to the objects as usual, but without overriding Lunchbox's built-in values.
