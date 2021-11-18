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

The easiest way to use a Lunchbox app in an HTML page is to use an iframe. You can also render Vue apps separately and mount the Lunchbox app in the HTML app:

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

Currently using a Lunchbox app directly inside an HTML app isn't supported:

```html
<template>
    <section class="wrapper">
        <h1>Title</h1>

        <!-- Will not work -->
        <Lunchbox>
            <!-- ... -->
        </Lunchbox>
    </section>
</template>
```

Mixing renderers in Vue 3 is something the Vue community is still working on - see [here](https://github.com/vuejs/vue-loader/pull/1645) for more information.
