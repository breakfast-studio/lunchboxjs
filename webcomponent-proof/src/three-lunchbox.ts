import { LitElement, css, html } from 'lit';
import * as THREE from 'three';

/** Wrapper element for ThreeLunchbox. */
export class ThreeLunchbox extends LitElement {
  // TODO: Customizable scene, camera, renderer args
  // TODO: Fully customizable scene, camera, renderer
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
  });

  /** ResizeObserver to handle container sizing */
  resizeObserver: ResizeObserver;

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
  }

  /** To run on start. */
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

  /** Container styles */
  // TODO: fill window, fit-to-container
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

  /** Render loop */
  // TODO: Only kick if required
  updateLoop() {
    this.renderThree();
    requestAnimationFrame(this.updateLoop.bind(this));
  }

  /** Render the 3D scene */
  renderThree() {
    this.renderer.render(this.scene, this.camera);
  }

  render() {
    // TODO: more robust slot changes
    return html`
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${this.renderer.domElement}
    `
  }
}