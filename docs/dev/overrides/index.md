# Overrides

Lunchbox [guidelines](/dev/#guidelines) mention providing clear overrides whenever assumptions are made. The assumptions that the `<Lunchbox>` wrapper makes leave us with this MiniDom hierarchy once it has mounted:

```
| Root
| -- Renderer
| -- Scene
| -- Camera
```

From here, most apps will implicitly add objects (meshes, models, lights, etc) to the Scene:

```html
<Lunchbox>
    <mesh>
        <boxGeometry />
        <meshBasicMaterial />
    </mesh>

    <pointLight />

    <!-- etc... -->
</Lunchbox>
```

results in:

```
| Root
| -- Renderer
| -- Camera
| -- Scene
| ----- Mesh
| ------- BoxGeometry
| ------- MeshBasicMaterial
| ----- PointLight
```

This is enough for many Three.js apps, but in order to support more complex setups and be as futureproof as possible, Lunchbox makes it possible to override these default assumptions.

## Custom Scene, Camera, and Renderer (DEPRECATED)

(The rules for these three object types are the same, so we'll be using a Scene as an example.)

A Scene can be added directly to the wrapper:

```html
<Lunchbox>
    <scene>
        <mesh> <!-- ... --> </mesh>
    </scene>
</Lunchbox>
```

By default, the first Scene in the user's markup is saved as the default Scene, which is provided to `onStart`, `onBeforeRender`, and several other places.

This means you can alternate between different Scenes. Changing Scenes will trigger a `onSceneReady` callback, if you import and use that function:

```html
<template>
    <Lunchbox>
        <scene v-if="showSceneOne">
            <mesh> <!-- ... --> </mesh>
        </scene>
        <scene v-else>
            <!-- ... -->
        </scene>
    </Lunchbox>
</template>

<script setup>
    import { onSceneReady } from 'lunchboxjs'
    import { ref } from 'vue'

    // alternate scene every 1000ms
    const showSceneOne = ref(true)
    setInterval(() => (showSceneOne.value = !showSceneOne.value), 1000)

    onSceneReady((scene) => {
        // fires each scene change
        console.log(scene)
    })
</script>
```

Note that you'll need to write your own code to handle multiple scenes - Lunchbox only handles one scene, camera, and renderer automatically.

## Next Steps

Now that you know the main ideas Lunchbox's internals, take a look at [next steps](/dev/contributing/) for reporting bugs and suggesting/contributing features!
