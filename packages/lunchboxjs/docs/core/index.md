# Core Concepts

## `Lunchbox`

A Lunchbox app needs to be wrapped in a `Lunchbox` wrapper:

```html
<Lunchbox>
    <!-- Your code -->
</Lunchbox>
```

In a .vue [single file component](https://v3.vuejs.org/guide/single-file-component.html#single-file-components), this will be inside the `<template>` tag.

See the [Wrapper](/components/wrapper/) page for more information and available props.

## Three.js and Lunchbox

Almost all Lunchbox components are direct translations of Three.js concepts. Let's look at [meshes](https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh) as an example.

A standard Three.js mesh requires a geometry and a material. Three.js code to create and add a yellow cube to the scene might look like [this](https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh):

```js
// create geometry with sides of length 1
const geometry = new THREE.BoxGeometry(1, 1, 1)
// create yellow basic material
const material = new THREE.MeshBasicMaterial({ color: 0xffff00 })
// combine geometry + material in mesh
const mesh = new THREE.Mesh(geometry, material)

// create a scene...
const scene = new THREE.Scene()
// ... and add the mesh to the scene
scene.add(mesh)
```

In Lunchbox, this produces the same result:

```html
<Lunchbox>
    <mesh>
        <boxGeometry :args="[1, 1 ,1]" />
        <meshBasicMaterial :color="0xffff00" />
    </mesh>
</Lunchbox>
```

A few points to note:

-   Lunchbox creates a Scene, Camera, and Renderer automatically. Adding children to your Lunchbox wrapper adds them to the Scene by default. (There's also support for [overriding defaults](/advanced/custom-cameras-renderers-and-scenes/) for more advanced use cases.)

-   Lunchbox component names match camelCased Three.js class names.

```jsx
// three.js
new THREE.Mesh()

<!-- Lunchbox -->
<mesh/>

// three.js
new THREE.BoxGeometry()

<!-- Lunchbox -->
<boxGeometry/>
```

-   Every component can accept an `args` prop that take an array of arguments to pass to class constructors. This in Three.js:

```js
new THREE.BoxGeometry(1, 2, 3)
```

would map to this in Lunchbox:

```html
<boxGeometry :args="[1, 2, 3]" />
```

-   Any property you can add to a Three.js object (for example, the `color` property of a `MeshBasicMaterial`) can be added as a reactive prop on a Lunchbox component. For example, this yellow material:

```js
const material = new THREE.MeshBasicMaterial()
material.color = 0xffff00
```

would map to this in Lunchbox:

```html
<meshBasicMaterial :color="0xffff00" />
```

-   Any property without a value will be set to `true` by default:

```html
<meshBasicMaterial wireframe />
<!-- is the same as: -->
<meshBasicMaterial :wireframe="true" />
```

-   You can set a property that would normally use dot notation with a dash in the prop name. For example, this in Three.js:

```js
const mesh = new THREE.Mesh()
mesh.position.z = 5
```

would map to this in Lunchbox:

```html
<mesh :position-z="5" />
```

## Components

You can use the most common Three.js classes in Lunchbox right away, such as:

-   `Group`
-   `Mesh`
-   Geometries (box, icosahedron, plane, etc)
-   Materials (standard, basic, points, shader, etc)
-   Lights (spotlights, point lights, directional, etc)

For more information, see [Components](/components/).

To add any features not in that list, see the instructions under [Extend](/components/extend/).
