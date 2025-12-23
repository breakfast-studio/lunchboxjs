//@ts-nocheck

import { customElement } from 'lit/decorators.js';
import { initLunchbox } from './src/index.ts';
import { html, LitElement } from 'lit';
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