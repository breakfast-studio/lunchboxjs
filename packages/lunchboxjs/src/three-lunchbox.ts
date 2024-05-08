import { LitElement, css, html } from 'lit';
import * as THREE from 'three';
import { THREE_UUID_ATTRIBUTE_NAME } from './utils';
import { RAYCASTABLE_ATTRIBUTE_NAME } from './three-base';
import { Lunchbox, THREE_CLICK_EVENT_NAME, THREE_POINTER_MOVE_EVENT_NAME, ThreeIntersectEvent } from '.';
import parse from 'json5/lib/parse';
import { setThreeProperty } from './setThreeProperty';
import { property } from 'lit/decorators.js';

/** Wrapper element for ThreeLunchbox. */
export class ThreeLunchbox extends LitElement {
  // Utils
  // ==================
  private scratchV2 = new THREE.Vector2();
  // private scratchV3 = new THREE.Vector3();

  // TODO: Customizable scene, camera, renderer args
  // TODO: Fully customizable scene, camera, renderer
  three = {
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(75),
    renderer: new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    }),
  };

  @property()
  background: THREE.ColorRepresentation | null = null;

  @property()
  sizePolicy: 'container' | 'full' = 'full';

  /** ResizeObserver to handle container sizing */
  resizeObserver: ResizeObserver;

  constructor() {
    super();

    // Camera, scene, renderer information
    (['scene', 'camera', 'renderer'] as const).forEach(key => {
      const options = parse(this.getAttribute(key) ?? '{}');
      // properties
      Object.entries(options).forEach(([k, v]) => {
        // set property
        setThreeProperty(this.three[key], k.split('-'), v);
      });
    });

    // Resize observer
    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(({ target, contentRect }) => {
        if (target === this) {
          this.three.renderer.setSize(contentRect.width, contentRect.height);
          this.three.camera.aspect = contentRect.width / contentRect.height;
          this.three.camera.updateProjectionMatrix();
          this.renderThree();
        }
      });
    });
  }

  /** To run on start. */
  connectedCallback(): void {
    super.connectedCallback();
    this.resizeObserver.observe(this);

    // Background color
    if (this.background !== null) {
      this.three.scene.background = new THREE.Color(this.background);
    }

    // Prep mouse info
    this.three.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.addEventListener('click', this.onClick.bind(this));
    // this.renderer.domElement.addEventListener('touchstart', this.onClick.bind(this));


    // Kick update loop
    this.updateLoop();
  }

  disconnectedCallback(): void {
    this.three.renderer.domElement.removeEventListener('pointermove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.removeEventListener('click', this.onClick.bind(this));
    // this.renderer.domElement.removeEventListener('touchstart', this.onClick.bind(this));
    this.three.renderer.dispose();

    cancelAnimationFrame(this.frame);
  }

  handleDefaultSlotChange(evt: { target: HTMLSlotElement }) {
    evt.target.assignedElements().forEach(el => {
      const elAsThree = el as unknown as Lunchbox<unknown>;
      if (elAsThree.instance instanceof THREE.Object3D) {
        // TODO: optimize so we're not searching through whole scene graph
        let alreadyExists = false;
        this.three.scene.traverse(child => {
          if (alreadyExists) return;

          if (child.uuid === (elAsThree.instance as THREE.Object3D).uuid) {
            alreadyExists = true;
          }
        });
        if (alreadyExists) return;

        // add to scene
        this.three.scene.add(elAsThree.instance);

        // Add to raycast pool
        if (el.getAttributeNames().includes(RAYCASTABLE_ATTRIBUTE_NAME)) {
          this.raycastPool.push(elAsThree.instance);
        }
      }
    });

    this.renderThree();
  }

  // Raycast/pointer information
  // ==================
  raycaster = new THREE.Raycaster();
  raycastPool: THREE.Object3D[] = [];
  runRaycast(evt: {
    clientX: number,
    clientY: number,
  }) {
    if (!this.raycastPool.length) return [];

    const ndc = this.scratchV2.clone().set(
      (evt.clientX / this.three.renderer.domElement.width) * 2 - 1,
      -(evt.clientY / this.three.renderer.domElement.height) * 2 + 1
    );

    this.raycaster.setFromCamera(ndc, this.three.camera);
    const intersects = this.raycaster.intersectObjects(this.raycastPool);
    const matches = intersects.map(intersect => {
      return {
        intersect,
        // TODO: cache result of this query selector somewhere?
        element: this.querySelector(`[${THREE_UUID_ATTRIBUTE_NAME}="${intersect.object.uuid}"]`)
      };
    });
    return matches;
  }

  // Pointer movement
  // ==================
  onPointerMove(evt: PointerEvent) {
    const matches = this.runRaycast.bind(this)(evt);

    matches.forEach(match => {
      match.element?.dispatchEvent(new PointerEvent('pointermove'));
      match.element?.dispatchEvent(new CustomEvent<ThreeIntersectEvent>(THREE_POINTER_MOVE_EVENT_NAME, { detail: match }));
    });
  }

  // Click handling
  // ==================
  onClick(evt: TouchEvent | MouseEvent) {
    let matches = [] as ReturnType<typeof this.runRaycast>;
    if (evt instanceof TouchEvent) {
      const touch = evt.touches[0];
      matches = this.runRaycast.bind(this)(touch);
      matches.forEach(match => {
        match.element?.dispatchEvent(new TouchEvent('touchstart'));
      });

    } else {
      matches = this.runRaycast.bind(this)(evt);
      matches.forEach(match => {
        match.element?.dispatchEvent(new MouseEvent('click'));
      });
    }

    matches.forEach(match => {
      match.element?.dispatchEvent(new CustomEvent<ThreeIntersectEvent>(THREE_CLICK_EVENT_NAME, { detail: match }));
    });
  }

  /** Container styles */
  // TODO: fill window, fit-to-container
  static styles = css`
    :host {
      width: 100%;
      height: 100%;
      display: block;
    }

    canvas {
      width: 100%;
      height: 100%;
    }
  `;

  /** Render loop */
  frame: number = Infinity;
  // TODO: Only kick if required
  updateLoop() {
    this.renderThree();
    this.frame = requestAnimationFrame(this.updateLoop.bind(this));
  }

  /** Render the 3D scene */
  renderThree() {
    this.three.renderer.render(this.three.scene, this.three.camera);
  }

  render() {
    // TODO: more robust slot changes
    return html`
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${this.three.renderer.domElement}
    `;
  }
}