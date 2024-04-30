import { LitElement, css, html } from 'lit'

export class ThreeLunchbox extends LitElement {

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75);
  renderer = new THREE.WebGLRenderer();

  constructor() {
    super();
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(({ target, contentRect }) => {
        if (target === this) {
          this.renderer.setSize(contentRect.width, contentRect.height)
          this.camera.aspect = contentRect.width / contentRect.height;
          this.camera.updateProjectionMatrix();
          this.renderThree();
        }
      })
    })
    this.camera.position.set(0, 0, 5)
  }

  resizeObserver: ResizeObserver;

  connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver.observe(this);
    this.updateLoop();
  }

  handleDefaultSlotChange(evt: { target: HTMLSlotElement }) {
    evt.target.assignedElements().forEach(el => {
      const elAsThree = el as unknown as Lunchbox<any>
      if (elAsThree.instance instanceof THREE.Object3D) {
        this.scene.add(elAsThree.instance)
      }
    })

    this.renderThree();
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `

  updateLoop() {
    this.renderThree();
    requestAnimationFrame(this.updateLoop.bind(this));
  }
  renderThree() {
    this.renderer.render(this.scene, this.camera);
  }


  render() {
    return html`
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${this.renderer.domElement}
    `
  }
}



// Programmatically-generated elements
import * as THREE from 'three';
import { buildClass } from './three-base';

const autoComponents: Partial<keyof typeof THREE>[] = [
  'WebGLRenderer',
  'PerspectiveCamera',
  'Scene',
  'Mesh',
  'BoxGeometry',
  'MeshBasicMaterial',
  'IcosahedronGeometry',
  'SphereGeometry',
]

export const init = () => {
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