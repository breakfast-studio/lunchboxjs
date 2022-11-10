# LunchboxJS Official Plugins

To use:

```sh
npm i lunchboxjs-plugins
```

Then, when you're mounting your Lunchbox app:

```ts
import { createApp } from 'lunchboxjs'
// example: import a single plugin
import { orbit } from 'lunchboxjs-plugins'
// import all plugins
import * as Plugins from 'lunchboxjs-plugins'
import MyLunchboxApp from 'App.vue'

createApp(MyLunchboxApp
    // example: use <orbit/> wrapper
    .use(orbit)
    // use the <gltf/> wrapper (from wildcard import):
    .use(Plugins.gltf)
    .mount('#app')
```

## Creating new plugins

To create a new plugin:

1. Create a folder called `your-plugin` in `src`.
2. Add a `your-plugin.ts` file in that folder.
3. Export a new `Plugin` (ie, an instance of `import type { Plugin } from 'vue'`) that runs the needed setup in the `install` function.
4. Export this new plugin from `src/plugins.ts` (ie, `export { yourPlugin } from 'your-plugin/your-plugin.ts`).
5. Add the new plugin in the `PLUGIN_ENTRY_POINTS` array in `vite.config.ts`.

Your plugin should now build and export correctly, both as a standalone plugin and part of the full plugins export.
