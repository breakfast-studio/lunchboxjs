# Utilities

Lunchbox comes with several built-in utilities to make development easier.

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

## `camera`, `renderer`, and `scene`

The current camera, renderer, and scene are all available as exports. Note that when your code runs, these may be null or undefined, so the [`useX`](#onCameraReady-userenderer-and-usescene)version of these might be easier to use.

## `onCameraReady`, `useRenderer`, and `useScene`

Provide a function to be called when the camera, renderer, or scene is available. Accepts the primary camera, renderer, or scene as an argument.

```js
import { onCameraReady, useRenderer, useScene } from '../../src'

// run every camera/renderer/scene change
onCameraReady((cam) => console.log(cam))
useRenderer((renderer) => console.log(renderer))
useScene((scene) => console.log(scene))
```

Note that in TypeScript, `onCameraReady` and `useRenderer` can support generic types:

```ts
import { onCameraReady, useRenderer } from '../../src'

onCameraReady<THREE.OrthographicCamera>((cam) => {
    // `cam` is an instance of OrthographicCamera
    console.log(cam)
})
useRenderer</* any type inheriting from THREE.Renderer */>((renderer) =>
    console.log(renderer)
)
```
