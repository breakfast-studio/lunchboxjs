# Overrides

Lunchbox [guidelines](/dev/#guidelines) mention providing clear overrides whenever assumptions are made. The assumptions that the `<Lunchbox>` wrapper makes leave us with this MiniDom hierarchy once it has mounted:

```
| Root
| -- Renderer
| -- Scene
| -- Camera
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

results in:

```
| Root
| -- Renderer
| -- Camera
| -- Scene
| ----- Mesh
| ------- BoxGeometry
| ------- MeshBasicMaterial
| ----- PointLight
```

This is enough for many Three.js apps, but in order to support more complex setups and be as futureproof as possible, Lunchbox makes it possible to override these default assumptions using [named slots](https://vuejs.org/guide/components/slots.html#named-slots).

(More documentation on this feature coming soon! Reach out to [Sander](https://github.com/SaFrMo) if more information is needed before then.)
