# Getting Started

## Overview

Lunchbox lets you write [ThreeJS](https://threejs.org/) scenes using [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components). It's like [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) for any (or no) JS framework.

Write this:

```html
<three-lunchbox>
    <three-mesh position-z="-5">
        <torus-knot-geometry />
        <mesh-normal-material />
    </three-mesh>
</three-lunchbox>
```

And get this:

<three-lunchbox>
    <three-mesh position-z="-5">
        <torus-knot-geometry />
        <mesh-normal-material />
    </three-mesh>
</three-lunchbox>
