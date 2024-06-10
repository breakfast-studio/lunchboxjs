# Components

Lunchbox 2 contains:

* Built-in components
* Several automatically-registered ThreeJS components
* The ability to add your own components via `extend`

## Built-in components

### `<three-lunchbox>` wrapper

The `<three-lunchbox>` wrapper handles several common use cases for ThreeJS scenes. It automatically creates a scene, WebGLRenderer, and camera, and adds a canvas to the DOM that stretches to fit its container.

Available attributes are:

| Name         | Default value | Notes                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `background` | `null`        | Background color of the scene. Any [ThreeJS color representation](https://threejs.org/docs/#api/en/math/Color) will work. <br/><br/>`<three-lunchbox background="blue">`<br/>`<three-lunchbox background="#0f0">`<br/>(etc)                                                                                                                                                           |
| `dpr`        | `Infinity`    | [Device pixel ratio](https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio). Will automatically adjust to the screen's DPR if set to `Infinity`.                                                                                                                                                                                                                   |
| `scene`      | `null`        | Options to pass to the default scene. Accepts an object that is parsed and whose values are sent to the scene. See `camera` below for formatting.                                                                                                                                                                                                                                     |
| `renderer`   | `null`        | Options to pass to the default renderer. Accepts an object that is parsed and whose values are sent to the renderer. See `camera` below for formatting.                                                                                                                                                                                                                               |
| `camera`     | `null`        | Options to pass to the default camera. Accepts an object that is parsed and whose values are sent to the camera.<br/><br/>Nested values can be set by replacing dot notation with a dash.<br/><br/>Set `camera.position.z` to 5:<br/>`<three-renderer camera="{'position-z': 5}">`<br/><br/>Set `camera.position` to 1, 2, 3:<br/>`<three-renderer camera="{'position': [1, 2, 3]}">` |

#### The `three` property of `<three-lunchbox>`

A `three-lunchbox` component contains a property called `three` with ThreeJS details. For example:

```js
const lunchbox = document.querySelector('three-lunchbox');
console.log(lunchbox.three);
```

Current properties of `three` are:

| Property   | Notes                     |
| ---------- | ------------------------- |
| `scene`    | The component's scene.    |
| `camera`   | The component's camera.   |
| `renderer` | The component's renderer. |

In TypeScript, you can get type completion by querying the `ThreeLunchbox` type:

```ts
import { type ThreeLunchbox } from 'lunchboxjs';
const lunchbox = document.querySelector<ThreeLunchbox>('three-lunchbox');
console.log(lunchbox?.three);
```

## Auto-registered components

All ThreeJS classes listed [here](https://github.com/breakfast-studio/lunchboxjs/blob/main/packages/lunchboxjs/src/auto-components.ts) can be used out of the box with Lunchbox 2. Elements must be separated by a dash if the class name is two or more words:

```html
<!-- right -->
<box-geometry></box-geometry>

<!-- wrong -->
<boxGeometry></boxGeometry>
```

If the class name is one word, prepend `three-` to the element name:

```html
<!-- right -->
<three-mesh></three-mesh>

<!-- wrong -->
<mesh></mesh>
```

See [core concepts](/concepts#three-js-and-lunchbox) for attribute notes.

### The `instance` property

All auto-registered components and components created by `extend` (see [below](#custom-components-via-extend)) contain an `instance` property that holds the underlying ThreeJS object. For example:

```html
<box-geometry></box-geometry>

<script>
const boxGeometry = document.querySelector('box-geometry');
console.log(boxGeometry.instance); // logs the BoxGeometry held by the component
</script>
```

In TypeScript, this you can get type completion with the `Lunchbox` generic type:

```ts
import { type Lunchbox } from 'lunchboxjs';
import * as THREE from 'three';

const boxGeometry = document.querySelector<Lunchbox<THREE.BoxGeometry>>('box-geometry');
console.log(boxGeometry?.instance); // logs the BoxGeometry held by the component
```

You can do anything with an `instance` that you would do with a standard ThreeJS object - for example:

```js
const mesh = document.querySelector('three-mesh');
// add a child to the selected mesh
mesh.instance.add(new THREE.Mesh(
    new THREE.BoxGeometry(),
    new THREE.MeshBasicMaterial(),
));
```

This is a contrived example, since it would usually be easier to add a child via another `<three-mesh>` element; doing so also handles disposal automatically when removing the element from the DOM, while in the example above you would need to handle disposal manually. 

Accessing `instance` is most useful when handling animations or large quantities of components/updates that would otherwise be expensive to add in the DOM.

## Custom components via `extend`

TODO