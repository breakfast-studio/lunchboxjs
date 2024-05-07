import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import * as THREE from 'three';
import { IsClass, THREE_UUID_ATTRIBUTE_NAME, get, isClass, isNumber, set } from "./utils";

export const RAYCASTABLE_ATTRIBUTE_NAME = 'raycast';
const BUILT_IN_ATTRIBUTES = [
    RAYCASTABLE_ATTRIBUTE_NAME,
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
            this.mutationObserver.observe(this, {
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
            if (this.instance instanceof THREE.Object3D) {
                this.setAttribute(THREE_UUID_ATTRIBUTE_NAME, this.instance.uuid);
            }

            // Do some attaching based on common use cases
            // ==================
            const parent = this.parentElement as ThreeBase;
            if (parent.instance) {
                // if we're a geometry or material, attach to parent
                if (this.instance instanceof THREE.BufferGeometry && parent.instance instanceof THREE.Mesh) {
                    parent.instance.geometry = this.instance;
                }
                if (this.instance instanceof THREE.Material && parent.instance instanceof THREE.Mesh) {
                    parent.instance.material = this.instance;
                }
                if (this.instance instanceof THREE.Object3D) {
                    if (parent.instance instanceof THREE.Object3D) {
                        parent.instance.add(this.instance);
                    }
                    if (parent.instance instanceof THREE.Scene) {
                        parent.instance.add(this.instance);
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

            // ignore Lunchbox-specific attributes
            if (BUILT_IN_ATTRIBUTES.includes(targetCase)) {
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

            // nested properties
            const split = targetCase.split('-');

            // current value
            if (this.instance) {
                const property: {
                    setScalar?: (n: number) => unknown,
                    set?: (...args: unknown[]) => unknown,
                } | undefined = get(this.instance, split);

                if (isNumber(parsedValue) && property?.setScalar) {
                    // Set scalar
                    property.setScalar(+parsedValue);
                } else if (property?.set) {
                    // try converting to an array of numbers
                    const asNumbers = parsedValue.split(',');
                    const isAllNumbers = asNumbers.every(n => n.match(/\d+/));
                    if (asNumbers?.length && isAllNumbers) {
                        property.set(...asNumbers.map(n => +n));
                    } else {
                        // Set as values in an array
                        const parsedValueAsArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
                        property.set(...parsedValueAsArray);
                    }

                } else {
                    // Manually set
                    set(this.instance, split, parsedValue);
                }

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

