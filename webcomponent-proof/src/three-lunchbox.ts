import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('three-lunchbox')
export class ThreeLunchbox extends LitElement {


  render() {
    return html`
      <slot name="renderer">
        <web-gl-renderer/>
      </slot>
      <slot name="camera">
        <perspective-camera/>
      </slot>
      <slot name="scene">
        <three-scene>
          <slot></slot>
        </three-scene>
      </slot>
    `
  }
}



// Programmatically-generated elements
import * as THREE from 'three';

const autoComponents: Partial<keyof typeof THREE>[] = [
  'WebGLRenderer',
  'PerspectiveCamera',
  'Scene',
]

autoComponents.forEach(className => {
  // convert name to kebab-case; prepend `three-` if needed
  let kebabCase = className.split(/\.?(?=[A-Z])/).join('-').toLowerCase().replace(/-g-l-/, '-gl-');
  if (!kebabCase.includes('-')) {
    kebabCase = `three-${kebabCase}`
  }

  customElements.define(kebabCase, class extends LitElement {
    render() {
      return html`
      <h1>${className}!</h1>
      <slot></slot>
      `
    }
  })
})
