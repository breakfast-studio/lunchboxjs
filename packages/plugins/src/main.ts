// standard plugins
import { createApp } from 'lunchboxjs'
import { App } from './App'
import { orbit } from './orbit/orbit'
import { gltf } from './gltf/gltf'

export const lunchboxApp = createApp(App).use(orbit).use(gltf)

// bridge plugin
import { createApp as createHtmlApp } from 'vue'
import { HtmlApp } from './bridge/demo/HtmlApp'
import { bridge } from './plugins'
createHtmlApp(HtmlApp).use(bridge).mount('#app')
