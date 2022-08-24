# Composables

Lunchbox comes with several built-in [composables](https://vuejs.org/guide/reusability/composables.html) and other utility functions to make development easier.

## `onBeforeRender` and `onAfterRender`

Provide a function to be called every frame before or after render. That function accepts an object with the following properties:

```js
{
    app // Lunch.App
    scene // THREE.Scene or null
    renderer // THREE.Renderer or null
    camera // THREE.Camera or null
}
```

For example:

```js
import { onBeforeRender } from 'lunchboxjs'

onBeforeRender((data) => {
    console.log(data)
    console.log(camera?.position)
})
```

## `offBeforeRender` and `offAfterRender`

Remove an already-added before/after render function. For example:

```js
import { onBeforeRender, offBeforeRender } from 'lunchboxjs'

// create and add the function
const update = () => {
    console.log(Date.now())
}
onBeforeRender(update)

// later, when you're ready to remove that function:
offBeforeRender(update)
```

## `onStart`

Provide a function to be called when the scene has initialized. The function accepts the same parameters as [onBefore/AfterRender](#onbeforerender-and-onafterrender).

```js
import { onStart } from 'lunchboxjs'

onStart(({ scene }) => {
    console.log(scene?.children)
})
```

## `useCamera`, `useRenderer`, and `useScene`

The current camera, renderer, and scene are all available as composables:

```html
<script setup>
    import { useCamera } from 'lunchboxjs'

    const camera = useCamera()
    // `camera.value` available to work with
</script>
```

Note that when your code runs, these may be null or undefined, so the [`onXReady`](#onCameraReady-onRendererReady-and-onSceneReady)version of these might be easier to use.

## `onCameraReady`, `onRendererReady`, and `onSceneReady`

Provide a function to be called when the camera, renderer, or scene is available. Accepts the primary camera, renderer, or scene as an argument.

```js
import { onCameraReady, onRendererReady, onSceneReady } from '../../src'

// run every camera/renderer/scene change
onCameraReady((cam) => console.log(cam))
onRendererReady((renderer) => console.log(renderer))
onSceneReady((scene) => console.log(scene))
```

Note that in TypeScript, `onCameraReady` and `onRendererReady` can support generic types:

```ts
import { onCameraReady, onRendererReady } from '../../src'

onCameraReady<THREE.OrthographicCamera>((cam) => {
    // `cam` is an instance of OrthographicCamera
    console.log(cam)
})
onRendererReady</* any type inheriting from THREE.Renderer */>((renderer) =>
    console.log(renderer)
)
```
