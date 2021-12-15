# Wrapper

A Lunchbox app needs to be wrapped in a `Lunchbox` wrapper:

```html
<Lunchbox>
    <!-- Your code -->
</Lunchbox>
```

## Props

The `Lunchbox` component comes with several shortcut props:

| Name                 | Type              | Default                                                                   | Notes                                                                                                                                                                 |
| -------------------- | ----------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background`         | String            |                                                                           | Background color of the renderer.                                                                                                                                     |
| `cameraArgs`         | Array             | PerspectiveCamera: `[45, 0.5625, 1, 1000]` <br/> OrthographicCamera: `[]` | Props to pass to the auto-created camera. Ignored if you provide your own camera.                                                                                     |
| `cameraLook`         | Array             |                                                                           | [x, y, z] coordinates to pass to `camera.lookAt`.                                                                                                                     |
| `cameraLookAt`       | Array             |                                                                           | Alias for `cameraLook`.                                                                                                                                               |
| `cameraPosition`     | Array             |                                                                           | [x, y, z] coordinates where the camera should be placed.                                                                                                              |
| `dpr`                | Number            |                                                                           | [Device pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). Defaults to current display's DPR.                                    |
| `ortho`              | Boolean           |                                                                           | Add or set to `true` to use an orthographic camera. Ignored if you provide your own camera.                                                                           |
| `orthographic`       | Boolean           |                                                                           | Alias of `ortho`.                                                                                                                                                     |
| `rendererProperties` | Object            |                                                                           | Object containing properties to set on renderer.                                                                                                                      |
| `shadow`             | Boolean or Object |                                                                           | Add or set to `true` to enable shadows. Pass an object with property `type` to set [shadow type](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap). |
| `transparent`        | Boolean           |                                                                           | Add or set to true to make the renderer's background transparent.                                                                                                     |
