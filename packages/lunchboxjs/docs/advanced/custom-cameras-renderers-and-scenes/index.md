# Custom Cameras, Renderers, and Scenes

Lunchbox creates its own default camera, renderer, and scene on creation, but you can also provide your own by tapping into the `camera`, `scene`, and `renderer` [named slots](https://vuejs.org/guide/components/slots.html#named-slots):

```html
<Lunchbox>
    <!-- this becomes the default camera -->
    <template #camera>
        <perspectiveCamera />
    </template>

    <!-- this becomes the default scene -->
    <template #scene>
        <scene>
            <mesh>...</mesh>
        </scene>
    </template>

    <!-- this becomes the default renderer -->
    <template #renderer>
        <webGLRenderer />
    </template>
</Lunchbox>
```

Custom cameras, renderers, and scenes are not yet reactive and are only set once at app start.
