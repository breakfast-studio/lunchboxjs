import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import * as THREE from 'three';
import { IsClass, THREE_UUID_ATTRIBUTE_NAME, isClass } from "./utils";
import { setThreeProperty } from "./setThreeProperty";

export const RAYCASTABLE_ATTRIBUTE_NAME = 'raycast';
export const IGNORED_ATTRIBUTES = [
    RAYCASTABLE_ATTRIBUTE_NAME,
    'args',
    'data',
];

export const buildClass = <T extends IsClass>(targetClass: keyof typeof THREE | IsClass) => {

    const threeClass = typeof targetClass === 'string' ? THREE[targetClass as keyof typeof THREE] : targetClass;

    if (!isClass(threeClass)) {
        return null;
    }

    class ThreeBase<U extends IsClass = T> extends LitElement {
        @property({ type: Array })
        args: ConstructorParameters<U> = [] as unknown as ConstructorParameters<U>;
        instance: U | null = null;

        dispose: (() => void)[] = [];

        mutationObserver: MutationObserver | null = null;

        connectedCallback(): void {
            super.connectedCallback();

            // Attribute mutation observation
            // ==================
            this.mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (!mutation.attributeName) return;
                    const attr = this.attributes.getNamedItem(mutation.attributeName);
                    if (attr) {
                        this.updateProperty(attr);
                    }
                });
            });
            this.mutationObserver.observe((this as unknown as Node), {
                attributes: true,
            });

            // Instance creation
            // ==================
            this.instance = new (threeClass as U)(...this.args) as unknown as U;
            // Populate initial attributes
            this.getAttributeNames().forEach(attName => {
                const attr = this.attributes.getNamedItem(attName);
                if (attr) {
                    this.updateProperty(attr);
                }
            });
            Array.from(this.attributes).forEach(this.updateProperty.bind(this));

            // Instance bookkeeping
            // ==================
            const instanceAsObject3d = this.instance as unknown as THREE.Object3D;
            if (instanceAsObject3d.uuid) {
                this.setAttribute(THREE_UUID_ATTRIBUTE_NAME, instanceAsObject3d.uuid);
            }

            // Do some attaching based on common use cases
            // ==================
            const parent = this.parentElement as ThreeBase;
            if (parent.instance) {
                const thisAsGeometry = this.instance as unknown as THREE.BufferGeometry;
                const thisAsMaterial = this.instance as unknown as THREE.Material;
                const parentAsMesh = parent.instance as unknown as THREE.Mesh;
                const parentAsAddTarget = parent.instance as unknown as { add?: (item: THREE.Object3D) => void };

                // if we're a geometry or material, attach to parent
                if (thisAsGeometry.type.toLowerCase().includes('geometry') && parentAsMesh.geometry) {
                    parentAsMesh.geometry = thisAsGeometry;
                }
                else if (thisAsMaterial.type.toLowerCase().includes('material') && parentAsMesh.material) {
                    parentAsMesh.material = thisAsMaterial;
                }
                else if (parentAsAddTarget.add) {
                    // If parent is an add target, add to parent
                    try {
                        parentAsAddTarget.add(instanceAsObject3d);
                    } catch (_) {
                        throw new Error(`Error adding ${this.tagName} to ${parentAsAddTarget}`);
                    }
                }
            }
        }

        /** Update an instance's property. When creating a `<mesh position-y="0.5">`, for example, this sets `mesh.position.y = 0.5`. */
        updateProperty(att: Attr) {
            const { name, value } = att;

            // find name with correct case, since attribute names are converted to all-lowercase by default
            let targetCase = name;
            Object.keys(this.instance ?? {}).forEach(key => {
                if (key.toLowerCase() === targetCase) {
                    targetCase = key;
                }
            });

            // nested properties
            const split = targetCase.split('-');

            // ignore Lunchbox-specific attributes
            if (IGNORED_ATTRIBUTES.includes(targetCase) || IGNORED_ATTRIBUTES.includes(split[0])) {
                return;
            }

            // handle non-events
            // ==================
            // TODO: parse objects as non-JSON (`{&quot;test&quot;: 1}` is annoying to write)
            let parsedValue = value;
            try {
                parsedValue = JSON.parse(value === '' ? 'true' : value);
            } catch (_err) {
                // noop, since allowed values can fail JSON parsing
            }


            // current value
            if (this.instance) {
                setThreeProperty(this.instance, split, parsedValue);
            }
        }

        disconnectedCallback(): void {
            super.disconnectedCallback();

            if (this.instance instanceof THREE.BufferGeometry
                || this.instance instanceof THREE.Material
                || this.instance instanceof THREE.Texture) {
                this.instance.dispose();
            }
            if (this.instance instanceof THREE.Object3D) {
                this.instance.removeFromParent();
            }
        }

        /** Render */
        render() {
            return html`<slot></slot>`;
        }
    }
    return ThreeBase;
};

