//@ts-nocheck

import { customElement, state } from 'lit/decorators.js';
import { initLunchbox, ThreeLunchbox } from './src/index.ts';
import { html, LitElement, nothing } from 'lit';
import { ref } from 'lit/directives/ref.js';
initLunchbox();


@customElement('sample-parent')
class SampleParent extends LitElement {
  protected render() {
    return html`<three-mesh position="[2, 0, -5]" data-name="scaled" scale="2">
            <box-geometry></box-geometry>
            <mesh-basic-material wireframe color="green"></mesh-basic-material>
          </three-mesh>
          <slot></slot>
        `
  }
}

@customElement('wrapped-lunchbox')
class WrappedLunchbox extends LitElement {
  @state()
  ready = false;

  lunchbox: ThreeLunchbox | null = null;

  get three(){
    return this.lunchbox?.three;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.ready = true
    }, 100);
  }

  protected render() {
    return html`<three-lunchbox ${ref(el => this.lunchbox = el)} style="position: absolute; inset: 0;">
      ${this.ready ? html`<slot></slot>` : nothing}
      <three-mesh position="[2, 0, -5]" data-name="scaled" scale="2">
        <box-geometry></box-geometry>
        <mesh-basic-material wireframe color="green"></mesh-basic-material>
      </three-mesh>
    </three-lunchbox>`
  }
}

@customElement('anchor-test')
class SlotTest extends LitElement {
  protected render() {
    return html`
      <three-group position="[1, 1, -5]">
        <html-anchor>
          <div data-test-id="label" style="position: absolute; top: var(--top); left: var(--left); background: white">
            test!
          </div>
        </html-anchor>
      </three-group>
    `
  }

  protected createRenderRoot() {
    return this;
  }
}