import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import * as THREE from 'three';
import { get, set } from "./utils";

type IsClass<T = unknown> = {
    new(...args: any): T
}

function isClass(obj: any): obj is IsClass {
    const isCtorClass = obj.constructor
        && obj.constructor.toString().substring(0, 5) === 'class'
    if (obj.prototype === undefined) {
        return isCtorClass
    }
    const isPrototypeCtorClass = obj.prototype.constructor
        && obj.prototype.constructor.toString
        && obj.prototype.constructor.toString().substring(0, 5) === 'class'
    return isCtorClass || isPrototypeCtorClass
}


export const buildClass = <T extends IsClass>(className: keyof typeof THREE) => {

    const threeClass = THREE[className];

    if (isClass(threeClass)) {

        class ThreeBase extends LitElement {
            @property({ type: Array })
            args: ConstructorParameters<T> = [] as any;

            @property()
            instance: T | null = null;

            connectedCallback(): void {
                this.instance = new (threeClass as T)(...this.args) as unknown as T;

                Array.from(this.attributes).forEach(att => {
                    const { name, value } = att
                    const parsedValue = JSON.parse(value === '' ? 'true' : value);

                    const split = name.split('-');

                    const property: any = get(this.instance as any, split)

                    if (property?.set) {
                        const parsedValueAsArray = Array.isArray(parsedValue) ? parsedValue : [parsedValue];
                        property.set(...parsedValueAsArray);
                    } else {
                        set(this.instance as any, split, parsedValue)
                    }
                })

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


            /** Render */
            render() {
                return html`<slot></slot>`
            }
        }

        return ThreeBase

    }


}

export type ThreeBase = ReturnType<typeof buildClass>