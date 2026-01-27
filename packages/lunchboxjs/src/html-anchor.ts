import { html, LitElement } from "lit";
import { Lunchbox, ThreeLunchbox } from ".";
import * as THREE from "three";
import { closestPassShadow } from "./utils";

export class HtmlAnchor extends LitElement {
  private parentLunchbox: Lunchbox<THREE.Object3D> | null = null;
  private frame = -1;
  private scratchV3 = new THREE.Vector3();
  private scratchFrustum = new THREE.Frustum();
  private scratchMatrix4 = new THREE.Matrix4();

  /** Try attaching the update function to pass the parent's position to children. */
  tryAttachUpdate() {
    const instance = this.parentLunchbox?.instance;
    if (!instance) return false;
    if (!instance.isObject3D) throw new Error('html-anchor must be the child of an Object3D');

    // const lunchboxParent = closestPassShadow(this, 'three-lunchbox') as ThreeLunchbox | null;
    const lunchboxParent = closestPassShadow(this, (el) => {
      return !!(el as ThreeLunchbox)?.three?.renderer;
    }) as unknown as Pick<ThreeLunchbox, 'three'> | null;

    if (!lunchboxParent) {
      console.error('three-lunchbox parent required for html-anchor');
      return false;
    }
    const camera = lunchboxParent.three.camera;
    if (!camera) {
      console.error('camera required for html-anchor');
      return false;
    }
    const renderer = lunchboxParent.three.renderer;
    if (!renderer?.domElement) {
      console.error('renderer and DOM element required for html-anchor');
      return false;
    }

    const update = () => {
      this.frame = requestAnimationFrame(update);

      camera.updateMatrix();
      camera.updateMatrixWorld();
      
      // get projected position
      instance.getWorldPosition(this.scratchV3);
            const worldPosition = this.scratchV3.clone();
      this.scratchV3.project(camera);
      this.scratchV3.multiplyScalar(0.5).addScalar(0.5);
      this.scratchV3.y = 1 - this.scratchV3.y;
      const rendererSize = this.scratchV3.clone().set(renderer.domElement.width, renderer.domElement.height, 1);
      rendererSize.divideScalar(devicePixelRatio);
      this.scratchV3.multiply(rendererSize);
      
      // get distance from camera
      const distance = instance.position.clone().distanceTo(camera.getWorldPosition(this.scratchV3.clone()));

      // get presence in camera frustum
      this.scratchFrustum.setFromProjectionMatrix(this.scratchMatrix4.clone().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));
      const inFrustum = this.scratchFrustum.containsPoint(worldPosition);

      // apply position data as CSS vars
      this.style.setProperty('--left', `${this.scratchV3.x}px`);
      this.style.setProperty('--top', `${this.scratchV3.y}px`);
      this.style.setProperty('--distance-from-camera', `${distance}`);
      this.style.setProperty('--in-frustum', `${inFrustum ? 1 : 0}`);
      if (inFrustum){
        this.classList.add('in-frustum');
      } else {
        this.classList.remove('in-frustum');
      }
    }
    update();

    return true;
  }

  // Setup - save local parent and try adding update
  override connectedCallback() {
    super.connectedCallback();

    const parent = this.parentNode as Lunchbox<THREE.Object3D>;
    if (!parent) {
      throw new Error('html-anchor requires a 3D parent');
    }
    this.parentLunchbox = parent;
    const attached = this.tryAttachUpdate();
    if (!attached) {
      this.parentLunchbox.addEventListener('instanceadded', () => {
        const attachedAfterInstanceCreated = this.tryAttachUpdate();
        if (!attachedAfterInstanceCreated) throw new Error('error attaching html-anchor to Object3D')
      }, { once: true });
    }

  }

  // Teardown
  override disconnectedCallback(): void {
    if (this.frame !== -1) cancelAnimationFrame(this.frame);
  }


  override render(): unknown {
    return html`<slot></slot>`
  }

  override createRenderRoot() {
    return this;
  }
}