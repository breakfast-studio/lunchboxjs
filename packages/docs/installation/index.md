# Installation

## Lunchbox-Only Apps

Install the package:

`npm install lunchboxjs`

Then create and mount your app just like [Vue](https://v3.vuejs.org/guide/instance.html#creating-an-application-instance). The only difference is you import `createApp` from `lunchboxjs`, not `vue`:

```js
import { createApp } from 'lunchboxjs'
import App from './App.vue'

const app = createApp(App)
app.mount('#app')
```

From there, you can write in Vue [single file components (SFCs)](https://v3.vuejs.org/guide/single-file-component.html#single-file-components) or however else you write your Vue apps. (We'll be writing the rest of these docs in SFCs.)

## HTML Apps

### Plugin

⭐ **New as of version 0.2.1019 (Nov 2022)!** ⭐

Use the `lunchbox` plugin (included in the `lunchboxjs` package) to create a Lunchbox app inside a standard HTML app.

```js
// Example Vite setup
import { createApp } from 'vue'
import { lunchbox } from 'lunchboxjs'
import App from './App.vue'

createApp(App).use(lunchbox).mount('#app')
```

Then, in your `App.vue` component:

```vue
<template>
    <h1>My Lunchbox App</h1>
    <lunchbox :root="LunchboxApp" />
    <!-- ...etc... -->
</template>

<script setup>
import LunchboxApp from './LunchboxApp.vue'
</script>
```

Then, in your `LunchboxApp.vue` component:

```vue
<template>
    <lunchbox>
        <mesh>
            <boxGeometry />
            <!-- etc... -->
        </mesh>
    </lunchbox>
</template>
```

#### More options

Any props that the [wrapper component](/components/wrapper/) recognizes can be used on the HTML component:

```vue
<template>
    <lunchbox :root="LunchboxApp" background="transparent" ortho />
</template>

<script setup>
import LunchboxApp from './LunchboxApp.vue'
</script>
```

Along with a `root` prop, you can also set an `appSetup` prop to further modify the app. `appSetup` accepts one argument, the Lunchbox app, and must return the app:

```vue
<template>
    <lunchbox :root="LunchboxApp" :appSetup="appSetup" />
</template>

<script setup>
import LunchboxApp from './LunchboxApp.vue'

const appSetup = (app) => {
    // add plugins, components, and any other app-level info here
    // example:
    app.use(myPlugin)
    app.component(myComponent)
    app.provide(myProvide)

    // remember to return `app`!
    return app
}
</script>
```

Or you can provide an `app` prop to use an already-created (but not mounted) Lunchbox app:

```vue
<template>
    <lunchbox :app="lunchboxApp" />
</template>

<script setup>
import { createApp } from 'lunchboxjs'
import LunchboxApp from './LunchboxApp.vue'

const lunchboxApp = createApp(LunchboxApp)
// you can add plugins, etc here - for example:
lunchboxApp.use(myPlugin)
lunchboxApp.component(myComponent)
lunchboxApp.provide(myProvide)
</script>
```

### Alternative methods

You can also use a Lunchbox app in an HTML page with an iframe, or render Vue apps separately and mount the Lunchbox app in the HTML app:

```js
// Example Vite setup
import { createApp } from 'vue'
import { createApp as createLunchboxApp } from 'lunchboxjs'
import App from './App.vue'
import LunchboxApp from './LunchboxApp.vue'

// html app
const app = createApp(App)
app.mount('#app')

// lunchbox app
const lunchboxApp = createLunchboxApp(LunchboxApp)
// assuming there's an element with ID `lunchbox` in your HTML app
lunchboxApp.mount('#lunchbox')
```

The latter method is what the `lunchbox` plugin does under the hood, along with some additional provide/inject management.

### Notes

Note that this is a more roundabout creation method than a standard Vue component/plugin because Lunchbox is a full custom renderer, and mixing renderers in Vue 3 is something the Vue community is still working on - see [here](https://github.com/vuejs/vue-loader/pull/1645) for more information.
