import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('three-lunchbox')
export class ThreeLunchbox extends LitElement {


  render() {
    return html`
      <slot name="renderer">
        Renderer
      </slot>
      <slot name="camera"></slot>
      <slot name="scene"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'three-lunchbox': ThreeLunchbox
  }
}
