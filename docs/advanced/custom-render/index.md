# Custom Render Function

Sometimes you'll need to replace the default Lunchbox render function with your own. To do that, import and call `setCustomRender`, passing your new render function:

```js
import { setCustomRender } from '../../src'

setCustomRender((options) => {
    /*
    options = {
        app,        // The Lunchbox app
        scene,      // The current scene
                    // (equivalent to `import { scene } from 'lunchbox'`)
        renderer,   // The current renderer
                    // (equivalent to `import { renderer } from 'lunchbox'`)
        camera,     // The current camera
                    // (equivalent to `import { camera } from 'lunchbox'`)
    }
    */
})
```

To remove your custom render function and fall back to Lunchbox's default, call `clearCustomRender`:

```js
import { clearCustomRender } from '../../src'

clearCustomRender()
```

See [this example](https://github.com/breakfast-studio/lunchboxjs/blob/main/demo/custom-render/App.vue) for an example that manually toggles an EffectComposer for postprocessing.
