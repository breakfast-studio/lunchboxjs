import { buildClass } from './three-base'
import { IsClass } from './utils'

export * from './three-lunchbox'

export const extend = (name: string, classDefinition: IsClass) => {
    const result = buildClass(classDefinition);
    if (result) {
        customElements.define(name, result)
    }
}