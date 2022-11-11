import { defineComponent, provide, ref } from 'vue'
import { App } from '../../App'
import './HtmlApp.css'
import { gltf, orbit } from '../../plugins'
import { Lunch } from 'lunchboxjs'

export const HtmlApp = defineComponent({
    name: 'HtmlApp',
    setup() {
        // injections are passed into lunchbox instances
        const color = ref('green')
        provide('color', color)
        setTimeout(() => {
            color.value = 'dodgerblue'
        }, 1000)

        // add plugins to apps
        const appSetup = (app: Lunch.App) => app.use(orbit).use(gltf)

        // render function
        return () => (
            <main>
                <h1>LunchboxJS</h1>
                <lunchbox
                    class="container"
                    root={App}
                    appSetup={appSetup}
                    sizePolicy="container"
                    transparent
                />

                <lunchbox
                    class="container"
                    root={App}
                    appSetup={appSetup}
                    sizePolicy="container"
                    background="green"
                    ortho
                />
            </main>
        )
    },
})
