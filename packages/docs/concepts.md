# Core Concepts

## `three-lunchbox` wrapper

A Lunchbox app needs to be wrapped in a `three-lunchbox` wrapper:

```html
<three-lunchbox>
    <!-- Your code -->
</three-lunchbox>
```

See the [Wrapper](/components/component-guide#three-lunchbox-wrapper) page for more information and available props.

## Three.js and Lunchbox

Almost all Lunchbox components are direct translations of Three.js concepts. Let's look at [meshes](https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh) as an example.

A standard Three.js mesh requires a geometry and a material. Three.js code to create and add a yellow cube to the scene might look like [this](https://threejs.org/docs/index.html?q=mesh#api/en/objects/Mesh):

```js
// create geometry with sides of length 1
const geometry = new THREE.BoxGeometry(1, 1, 1)
// create yellow basic material
const material = new THREE.MeshBasicMaterial({ color: '#ffff00' })
// combine geometry + material in mesh
const mesh = new THREE.Mesh(geometry, material)

// create a scene...
const scene = new THREE.Scene()
// ... and add the mesh to the scene
scene.add(mesh)
```

In Lunchbox, this produces the same result:

```html
<three-lunchbox>
    <three-mesh>
        <box-geometry args="[1, 1 ,1]" />
        <mesh-basic-material color="#ffff00" />
    </three-mesh>
</three-lunchbox>
```

A few points to note:

### Auto-created Scene, Camera, Renderer

Lunchbox creates a Scene, Camera, and Renderer automatically. Adding children to your Lunchbox wrapper adds them to the Scene by default.

### Component names

Lunchbox component names match kebab-cased Three.js class names. If a Three.js class name is one word, add `three-` to the start of it.

```html
<script>
// three.js
new THREE.Mesh()
</script>

<!-- Lunchbox -->
<three-mesh/>

<script>
// three.js
new THREE.BoxGeometry()
</script>

<!-- Lunchbox -->
<box-geometry/>
```

### `args`

Every component can accept an `args` prop that take an array of arguments to pass to class constructors. This in Three.js:

```js
new THREE.BoxGeometry(1, 2, 3)
```

would map to this in Lunchbox:

```html
<box-geometry args="[1, 2, 3]" />
```

### Attributes

Any property you can add to a Three.js object (for example, the `color` property of a `MeshBasicMaterial`) can be added as a reactive attribute on a Lunchbox component. For example, this yellow material:

```js
const material = new THREE.MeshBasicMaterial()
material.color = '#ffff00'
```

would map to this in Lunchbox:

```html
<mesh-basic-material color="#ffff00" />
```

-   Any property without a value will be set to `true` by default:

```html
<mesh-basic-material wireframe />
<!-- is the same as: -->
<mesh-basic-material :wireframe="true" />
```

-   You can set a property that would normally use dot notation with a dash in the prop name. For example, this in Three.js:

```js
const mesh = new THREE.Mesh()
mesh.position.z = 5
```

would map to this in Lunchbox:

```html
<three-mesh position-z="5" />
```

### Object/array values

Lunchbox uses `JSON.parse` to parse attribute values from strings to objects/arrays. This means that double quotes are required:

```html
<!-- Both of these values pass `[{ antialias: true }]` array to the `renderer-args` attribute --> 
<!-- Note the attribute value is wrapped in single quotes...-->
<three-lunchbox renderer-args='[ { "antialias": true }  ]'>
<!-- ...or can use the &quot; special character -->
<three-lunchbox renderer-args="[ { &quot;antialias&quot;: true }  ]">

<!-- Doesn't work - fails when passed to JSON.parse -->
<three-lunchbox renderer-args="[ { antialias: true }  ]">
```

### Components

You can use the most common Three.js classes in Lunchbox right away, such as:

-   `Group`
-   `Mesh`
-   Geometries (box, icosahedron, plane, etc)
-   Materials (standard, basic, points, shader, etc)
-   Lights (spotlights, point lights, directional, etc)

See [here](/components/component-guide.html#auto-registered-components) for a full list. To add any components not in that list, see the instructions under [Extend](/components/component-guide#extend).
