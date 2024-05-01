import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import * as THREE from 'three';
import { IsClass, get, isClass, isNumber, set } from "./utils";

export const buildClass = <T extends IsClass>(targetClass: keyof typeof THREE | IsClass) => {

    const threeClass = typeof targetClass === 'string' ? THREE[targetClass as keyof typeof THREE] : targetClass;

    if (!isClass(threeClass)) {
        return null;
    }

    class ThreeBase extends LitElement {
        @property({ type: Array })
        args: ConstructorParameters<T> = [] as any;

        @property()
        instance: T | null = null;

        mutationObserver: MutationObserver | null = null;

        connectedCallback(): void {
            super.connectedCallback();

            this.mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (!mutation.attributeName) return;
                    const attr = this.attributes.getNamedItem(mutation.attributeName)
                    if (attr) {
                        this.updateProperty(attr)
                    }
                })
            })
            this.mutationObserver.observe(this, {
                attributes: true,
            })

            this.instance = new (threeClass as T)(...this.args) as unknown as T;

            // Populate initial attributes
            this.getAttributeNames().forEach(attName => {
                const attr = this.attributes.getNamedItem(attName);
                if (attr) {
                    this.updateProperty(attr);
                }
            })
            Array.from(this.attributes).forEach(this.updateProperty.bind(this))

            const parent = this.parentElement as ThreeBase;
            if (parent.instance) {
                // if we're a geometry or material, attach to parent
                if (this.instance instanceof THREE.BufferGeometry && parent.instance instanceof THREE.Mesh) {
                    parent.instance.geometry = this.instance
                }
                if (this.instance instanceof THREE.Material && parent.instance instanceof THREE.Mesh) {
                    parent.instance.material = this.instance
                }
            }
        }

        /** Update an instance's property. When creating a `<mesh position-y="0.5">`, for example, this sets `mesh.position.y = 0.5`. */
        updateProperty(att: Attr) {
            const { name, value } = att

            // find name with correct case, since attribute names are converted to all-lowercase by default
            let targetCase = name
            Object.keys(this.instance ?? {}).forEach(key => {
                if (key.toLowerCase() === targetCase) {
                    targetCase = key
                }
            })

            const parsedValue = JSON.parse(value === '' ? 'true' : value);

            const split = targetCase.split('-');

            const property: any = get(this.instance as any, split)

            if (isNumber(parsedValue) && property?.setScalar) {
                property.setScalar(parsedValue);
            } else if (property?.set) {
                const parsedValueAsArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
                property.set(...parsedValueAsArray);
            } else {
                set(this.instance as any, split, parsedValue)
            }
        }

        /** Render */
        render() {
            return html`<slot></slot>`
        }
    }
    return ThreeBase
}

export type ThreeBase = ReturnType<typeof buildClass>