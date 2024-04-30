import { autoComponents } from './auto-components'
import { buildClass } from './three-base'
import { ThreeLunchbox } from './three-lunchbox'
import { IsClass } from './utils'

export * from './three-lunchbox'

export const initLunchbox = () => {
    customElements.define('three-lunchbox', ThreeLunchbox)

    autoComponents.forEach(className => {
        // convert name to kebab-case; prepend `three-` if needed
        let kebabCase = className.split(/\.?(?=[A-Z])/).join('-').toLowerCase().replace(/-g-l-/, '-gl-');
        if (!kebabCase.includes('-')) {
            kebabCase = `three-${kebabCase}`
        }


        const result = buildClass(className)
        if (result) {
            customElements.define(kebabCase, result)
        }
    })
}

export const extend = (name: string, classDefinition: IsClass) => {
    const result = buildClass(classDefinition);
    if (result) {
        customElements.define(name, result)
    }
}