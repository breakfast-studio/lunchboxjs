# Internal Development

This section covers developing Lunchbox itself. Unless you're working on updates to the renderer, you probably want the [main documentation](/).

## Custom Renderer

Lunchbox is a [Vue 3 custom renderer](https://vuejs.org/api/custom-renderer.html). This means that it completely replaces the default Vue 3 DOM renderer with a Three.js-focused version.

There isn't too much documentation for custom Vue renderers at time of writing (spring/summer 2022), but to get an idea of what's involved, take a look at:

-   [Lachlan Miller's excellent writeup](https://lachlan-miller.me/articles/vue-3-pdf-customer-renderer)
-   The [@vue/runtime-test package](https://github.com/vuejs/core/tree/main/packages/runtime-test) for a relatively straightforward custom renderer
-   The [@vue/runtime-dom package](https://github.com/vuejs/core/tree/main/packages/runtime-dom) for Vue's actual DOM renderer.

## Guidelines

**Lunchbox's core goal is to be as hands-off as possible when it comes to Three.js implementation.** Three.js is a rapidly-changing library, so Lunchbox needs to make very few assumptions about how to set up and run a Three.js app. Practically, this means that in the renderer:

-   **We prefer direct translations to Three.js concepts over shortcuts.**

    ```html
    <!-- do: Mesh, BoxGeometry, and MeshBasicMaterial 
        are all Three.js classes -->
    <mesh>
        <boxGeometry />
        <meshBasicMaterial />
    </mesh>

    <!-- don't: easier to read, but there's no Three.js equivalent class -->
    <box />
    ```

-   **Where shortcuts are used, we prefer well-documented defaults and clear overrides over a one-size-fits-all solution.**

    ```html
    <!-- Documentation should specify that a camera, 
        renderer, and scene are all automatically created... -->
    <lunchbox>
        <mesh> ... </mesh>
    </lunchbox>

    <!-- ...as well as how those can be overridden if desired -->
    <lunchbox>
        <webGLRenderer ref="renderer" />

        <scene ref="scene1">
            <perspectiveCamera ref="scene1Camera" />
            <mesh> ... </mesh>
        </scene>
    </lunchbox>
    ```

    (Where to use shortcuts is a judgment call and should be discussed in [issues](https://github.com/breakfast-studio/lunchboxjs/issues) and [pull requests](https://github.com/breakfast-studio/lunchboxjs/pulls) before being decided on.)

-   **When in doubt, let Three.js, then Vue, decide.** Lunchbox should be a very thin translation layer between Vue and Three.js - the more we can let those frameworks dictate structure, the less maintenance Lunchbox will need as all libraries evolve.

With all that in mind, let's jump into [the internals](/dev/overview/)!
