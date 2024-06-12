import { LitElement, css, html } from 'lit';
import * as THREE from 'three';
import { THREE_UUID_ATTRIBUTE_NAME } from './utils';
import { RAYCASTABLE_ATTRIBUTE_NAME } from './three-base';
import { AFTER_RENDER_EVENT_NAME, BEFORE_RENDER_EVENT_NAME, Lunchbox, THREE_CLICK_EVENT_NAME, THREE_MOUSE_MOVE_EVENT_NAME, THREE_POINTER_MOVE_EVENT_NAME, ThreeIntersectEvent } from '.';
import parse from 'json5/lib/parse';
import { setThreeProperty } from './setThreeProperty';
import { property } from 'lit/decorators.js';
import { parseAttributeValue } from './parseAttributeValue';

const ORTHOGRAPHIC_CAMERA_ATTR_NAME = 'orthographic';
const DEFAULT_DPR = Infinity;

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
    camera: null as null | THREE.Camera,
    renderer: new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    }),
  };

  @property()
  background: THREE.ColorRepresentation | null = null;

  @property()
  dpr: number = DEFAULT_DPR;

  @property({
    attribute: 'manual-render',
    type: Boolean,
  })
  manualRender = false;

  @property({
    attribute: 'dispatch-before-render',
    type: Boolean,
  })
  dispatchBeforeRender = false;

  @property({
    attribute: 'dispatch-after-render',
    type: Boolean,
  })
  dispatchAfterRender = false;

  /** ResizeObserver to handle container sizing */
  resizeObserver: ResizeObserver;

  constructor() {
    super();

    this.resizeObserver = new ResizeObserver(entries => {
      entries.forEach(({ target, contentRect }) => {
        if (target === this as unknown as Element) {
          this.three.renderer.setSize(contentRect.width * this.dpr, contentRect.height * this.dpr);
          if (this.three.camera) {
            const aspect = contentRect.width / contentRect.height;
            if (this.three.camera.type.toLowerCase() === 'perspectivecamera') {
              // perspective camera
              (this.three.camera as THREE.PerspectiveCamera).aspect = aspect;
              (this.three.camera as THREE.PerspectiveCamera).updateProjectionMatrix();
            } else if (this.three.camera.type.toLowerCase() === 'orthographiccamera') {
              const heightInTermsOfWidth = contentRect.height / contentRect.width;
              // TODO: more flexible size?
              const SIZE = 10;
              (this.three.camera as THREE.OrthographicCamera).top = heightInTermsOfWidth * SIZE;
              (this.three.camera as THREE.OrthographicCamera).bottom = -heightInTermsOfWidth * SIZE;
              (this.three.camera as THREE.OrthographicCamera).right = SIZE;
              (this.three.camera as THREE.OrthographicCamera).left = -SIZE;
              (this.three.camera as THREE.OrthographicCamera).updateProjectionMatrix();
            }

            // Render on resize to avoid flicker
            if (!this.manualRender) {
              this.renderThree();
            }
          }
        }
      });
    });
  }

  /** To run on start. */
  connectedCallback(): void {
    super.connectedCallback();
    if (this.dpr === DEFAULT_DPR) {
      this.dpr = window.devicePixelRatio;
    }
    if (this.getAttribute(ORTHOGRAPHIC_CAMERA_ATTR_NAME) !== null) {
      this.three.camera = new THREE.OrthographicCamera();
    } else {
      this.three.camera = new THREE.PerspectiveCamera(75);
    }

    // Camera, scene, renderer information
    (['scene', 'camera', 'renderer'] as const).forEach(key => {
      const options = parse(this.getAttribute(key) ?? '{}');
      // properties
      Object.entries(options).forEach(([k, v]) => {
        if (this.three[key]) {
          // set property
          setThreeProperty(this.three[key]!, k.split('-'), parseAttributeValue(v, this));
        }
      });
    });

    // Resize observer
    this.resizeObserver.observe(this as unknown as Element);

    // Background color
    if (this.background !== null) {
      this.three.scene.background = new THREE.Color(this.background);
    }

    // Prep mouse info
    this.three.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.addEventListener('mousemove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.addEventListener('click', this.onClick.bind(this));
    // this.renderer.domElement.addEventListener('touchstart', this.onClick.bind(this));


    // Kick update loop
    if (!this.manualRender) {
      this.updateLoop();
    }
  }

  disconnectedCallback(): void {
    this.three.renderer.domElement.removeEventListener('pointermove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.removeEventListener('mousemove', this.onPointerMove.bind(this));
    this.three.renderer.domElement.removeEventListener('click', this.onClick.bind(this));
    // this.renderer.domElement.removeEventListener('touchstart', this.onClick.bind(this));
    this.three.renderer.dispose();
    this.resizeObserver.unobserve(this as unknown as Element);

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
    if (!this.raycastPool.length || !this.three.camera) return [];

    const ndc = this.scratchV2.clone().set(
      (evt.clientX / (this.three.renderer.domElement.width / this.dpr)) * 2 - 1,
      -(evt.clientY / (this.three.renderer.domElement.height / this.dpr)) * 2 + 1
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
  onPointerMove(evt: PointerEvent | MouseEvent) {
    const matches = this.runRaycast.bind(this)(evt);
    matches.forEach(match => {
      if (evt.type === 'pointermove') {
        match.element?.dispatchEvent(new PointerEvent('pointermove'));
        match.element?.dispatchEvent(new CustomEvent<ThreeIntersectEvent>(THREE_POINTER_MOVE_EVENT_NAME, { detail: match }));
      } else if (evt.type === 'mousemove') {
        match.element?.dispatchEvent(new MouseEvent('mousemove'));
        match.element?.dispatchEvent(new CustomEvent<ThreeIntersectEvent>(THREE_MOUSE_MOVE_EVENT_NAME, { detail: match }));
      }
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
      max-width: 100%;
      max-height: 100%;
    }
  `;

  /** Render loop */
  frame: number = Infinity;
  updateLoop() {
    this.renderThree();
    if (!this.manualRender) {
      this.frame = requestAnimationFrame(this.updateLoop.bind(this));
    }
  }

  /** Render the 3D scene. Optional scene/camera overrides; defaults to the internal scene and camera. */
  public renderThree(overrideScene?: THREE.Scene, overrideCamera?: THREE.Camera,) {
    if (this.dispatchBeforeRender) {
      this.dispatchEvent(new CustomEvent<object>(BEFORE_RENDER_EVENT_NAME, {}));
    }
    if (!this.three.camera) return;
    this.three.renderer.render(
      overrideScene ?? this.three.scene,
      overrideCamera ?? this.three.camera
    );
    if (this.dispatchAfterRender) {
      this.dispatchEvent(new CustomEvent<object>(AFTER_RENDER_EVENT_NAME, {}));
    }
  }

  render() {
    // TODO: more robust slot changes
    return html`
      <slot @slotchange=${this.handleDefaultSlotChange}></slot>
      ${this.three.renderer.domElement}
    `;
  }
}