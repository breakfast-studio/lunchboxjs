# Advanced components

Lunchbox 2 custom components have some features built in for advanced usage.

## `attach`

The `attach` attribute works the same way in Lunchbox as it does in [React](https://docs.pmnd.rs/react-three-fiber/api/objects#attach), namely: 

You can set `attach` as an attribute on a Lunchbox component and in most cases (see [below](#loaders) for exceptions) that component's `instance` will be set as the parent's `instance[attachValue]`.

For example, this:

```html
<!-- `geometry` and `material` are attached automatically in Lunchbox. -->
<!-- This is for illustration only. -->
 <three-mesh>
    <box-geometry attach="geometry"></box-geometry>
    <mesh-basic-material attach="material"></mesh-basic-material>
</three-mesh>
```

maps to this in ThreeJS:

```js
import * as THREE from 'three';

const mesh = new THREE.Mesh();
const boxGeometry = new THREE.BoxGeometry();
mesh.geometry = boxGeometry; // <-- this is the `attach="geometry"` on the box-geometry component

const material = new THREE.MeshBasicMaterial();
mesh.material = material; // <-- this is the `attach="material"` on the mesh-basic-material component
```

## Loaders

`attach` comes in useful with loaders, which have their own special behavior in Lunchbox.

Any component ending with `-loader` (`<texture-loader>`, for example) will do the following in Lunchbox:

1. Execute its `load` method, passing its `src` attribute as the URL
2. Save the result of its `load` method to its `loaded` property

For example, this is how to load a texture in Lunchbox:

```html
<three-mesh>
    <box-geometry></box-geometry>
    <mesh-basic-material>
        <texture-loader src="/three-favicon.png" attach="map"></texture-loader>
    </mesh-basic-material>
</three-mesh>
```

<three-lunchbox camera="{'position-z': 3}" background="#888">
    <three-mesh>
        <box-geometry></box-geometry>
        <mesh-basic-material transparent>
            <texture-loader src="/three-favicon.png" attach="map"></texture-loader>
        </mesh-basic-material>
    </three-mesh>
</three-lunchbox>