import { html, LitElement } from "lit";
import { Lunchbox, ThreeLunchbox } from ".";
import * as THREE from "three";

export class HtmlAnchor extends LitElement {
  private parentLunchbox: Lunchbox<THREE.Object3D> | null = null;
  private frame = -1;
  private scratchV3 = new THREE.Vector3();

  /** Try attaching the update function to pass the parent's position to children. */
  tryAttachUpdate() {
    const instance = this.parentLunchbox?.instance;
    if (!instance) return false;
    if (!instance.isObject3D) throw new Error('html-anchor must be the child of an Object3D');

    const lunchboxParent = this.closest('three-lunchbox') as ThreeLunchbox | null;
    if (!lunchboxParent) throw new Error('three-lunchbox parent required for html-anchor')
    const camera = lunchboxParent.three.camera;
    if (!camera) throw new Error('camera required for html-anchor');
    const renderer = lunchboxParent.three.renderer;
    if (!renderer?.domElement) throw new Error('renderer and DOM element required for html-anchor')

    const update = () => {
      this.frame = requestAnimationFrame(update);
      instance.getWorldPosition(this.scratchV3);
      this.scratchV3.project(camera);
      this.scratchV3.multiplyScalar(0.5).addScalar(0.5);
      this.scratchV3.y = 1 - this.scratchV3.y;
      const rendererSize = this.scratchV3.clone().set(renderer.domElement.width, renderer.domElement.height, 1);
      rendererSize.divideScalar(devicePixelRatio);
      this.scratchV3.multiply(rendererSize);
      Array.from(this.children).forEach(child => {
        (child as unknown as HTMLElement).style.setProperty('--left', `${this.scratchV3.x}px`);
        (child as unknown as HTMLElement).style.setProperty('--top', `${this.scratchV3.y}px`);
      })
    }
    update();

    return true;
  }

  // Setup - save local parent and try adding update
  connectedCallback() {
    super.connectedCallback();

    const parent = this.parentNode as Lunchbox<THREE.Object3D>;
    if (!parent) {
      throw new Error('html-anchor requires a 3D parent');
    }
    this.parentLunchbox = parent;
    const attached = this.tryAttachUpdate();
    if (!attached) {
      this.parentLunchbox.addEventListener('instancecreated', () => {
        const attachedAfterInstanceCreated = this.tryAttachUpdate();
        if (!attachedAfterInstanceCreated) throw new Error('error attaching html-anchor to Object3D')
      }, { once: true });
    }

  }

  // Teardown
  disconnectedCallback(): void {
    if (this.frame !== -1) cancelAnimationFrame(this.frame);
  }


  protected render(): unknown {
    return html`<slot></slot>`
  }
}