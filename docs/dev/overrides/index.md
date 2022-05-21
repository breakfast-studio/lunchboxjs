# Overrides

Lunchbox [guidelines](/dev/#guidelines) mention providing clear overrides whenever assumptions are made. The `<Lunchbox>` wrapper makes several assumptions, which leaves us with this MiniDom hierarchy once it has mounted:

```
| Root
| -- Renderer
| -- Camera
| -- Scene
```

From here, most apps will implicitly add objects (meshes, models, lights, etc) to the Scene:

```html
<Lunchbox>
    <mesh>
        <boxGeometry />
        <meshBasicMaterial />
    </mesh>

    <pointLight />

    <!-- etc... -->
</Lunchbox>
```

This is enough for many Three.js apps, but in order to support more complex setups and be as futureproof as possible, Lunchbox makes it possible to override these default assumptions.

## Custom Scene

A Scene can be added directly to the wrapper:

```html
<Lunchbox>
    <scene>
        <mesh> <!-- ... --> </mesh>
    </scene>
</Lunchbox>
```

By default, the first Scene in the user's markup is the default Scene, which is provided to `onStart`, `onBeforeRender`, and several other places.

This happens thanks to the setup in `ensure.ts` - let's take a deeper dive into that workflow.

### `ensure.ts`

Let's make a few assumptions about Three.js apps:

-   There are entities we can assume will be used in most, if not all, Three.js apps.
-   We can usually
