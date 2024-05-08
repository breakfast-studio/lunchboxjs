# Getting Started

## Overview

Lunchbox lets you write [ThreeJS](https://threejs.org/) scenes using [web components](https://developer.mozilla.org/en-US/docs/Web/API/Web_components) built into any browser. It's like [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) for any (or no) framework.

Write HTML like this:

```html
<three-lunchbox>
    <three-mesh position-z="-5">
        <torus-knot-geometry/>
        <mesh-normal-material/>
    </three-mesh>
</three-lunchbox>
```

And get this result:

<three-lunchbox>
    <three-mesh position-z="-5">
        <torus-knot-geometry/>
        <mesh-normal-material/>
    </three-mesh>
</three-lunchbox>
