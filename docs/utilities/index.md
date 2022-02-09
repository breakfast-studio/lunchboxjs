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
