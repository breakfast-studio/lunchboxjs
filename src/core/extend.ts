import { h, defineComponent } from 'vue'
import { catalogue } from '../components'
import { Lunch } from '..'

const createComponent = (tag: string) =>
    defineComponent({
        inheritAttrs: false,
        name: tag,
        render() {
            return h(tag, this.$attrs, this.$slots?.default?.() || [])
        }
    })

export const extend = ({ app, ...targets }: { app: Lunch.App, [key: string]: any }) => {
    Object.keys(targets).forEach(key => {
        app.component(key, createComponent(key))
        catalogue[key] = targets[key]
    })
}