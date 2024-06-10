import { LitElement, html } from "lit";
import { property } from "lit/decorators.js";
import * as THREE from 'three';
import { IsClass, THREE_UUID_ATTRIBUTE_NAME, isClass } from "./utils";
import { setThreeProperty } from "./setThreeProperty";
import { parseAttributeValue } from "./parseAttributeValue";

export const RAYCASTABLE_ATTRIBUTE_NAME = 'raycast';
export const IGNORED_ATTRIBUTES = [
    RAYCASTABLE_ATTRIBUTE_NAME,
    'args',
    'data',
];

const buildNestedPropertyArray = (input: string) => input.split('-');

export const buildClass = <T extends IsClass>(targetClass: keyof typeof THREE | IsClass) => {
    const threeClass = typeof targetClass === 'string' ? THREE[targetClass as keyof typeof THREE] : targetClass;
    if (!isClass(threeClass)) {
        return null;
    }

    class ThreeBase<U extends IsClass = T> extends LitElement {
        @property({ type: Array })
        args: ConstructorParameters<U> = [] as unknown as ConstructorParameters<U>;
        instance: U | null = null;
        loaded: unknown | null = null;

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
            this.instance = new (threeClass as U)(...this.args.map(arg => parseAttributeValue(arg, this))) as unknown as U;
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

            // Fire instancecreated event
            this.dispatchEvent(new CustomEvent('instancecreated', {
                detail: {
                    instance: this.instance,
                },
            }));


            // Do some attaching based on common use cases
            // ==================
            const parent = this.parentElement as ThreeBase;
            if (parent.instance) {
                const thisAsGeometry = this.instance as unknown as THREE.BufferGeometry;
                const thisAsMaterial = this.instance as unknown as THREE.Material;
                const parentAsMesh = parent.instance as unknown as THREE.Mesh;
                const thisAsLoader = this.instance as unknown as THREE.Loader;
                const parentAsAddTarget = parent.instance as unknown as { add?: (item: THREE.Object3D) => void };
                const thisIsALoader = this.tagName.toString().toLowerCase().endsWith('-loader');

                // if we're a geometry or material, attach to parent
                if (thisAsGeometry.type?.toLowerCase().includes('geometry') && parentAsMesh.geometry) {
                    parentAsMesh.geometry = thisAsGeometry;
                }
                else if (thisAsMaterial.type?.toLowerCase().includes('material') && parentAsMesh.material) {
                    parentAsMesh.material = thisAsMaterial;
                }
                // if we're a loader, start loading
                else if (thisIsALoader) {
                    const src = this.getAttribute('src');
                    if (!src) throw new Error('Loader requires a source.');

                    // load and try attaching
                    thisAsLoader.load(src, loaded => {
                        this.loaded = loaded;
                        const attachAttribute = this.getAttribute('attach');
                        if (attachAttribute) {
                            this.executeAttach(attachAttribute, loaded);
                        }
                        this.dispatchEvent(new CustomEvent('loaded', {
                            detail: {
                                loaded,
                            },
                        }));
                    }, undefined, error => {
                        throw new Error(`error loading: ${src}` + error);
                    });
                }
                // otherwise, try to add as a child of the parent
                else if (parentAsAddTarget.add) {
                    // If parent is an add target, add to parent
                    try {
                        parentAsAddTarget.add(instanceAsObject3d);
                    } catch (_) {
                        throw new Error(`Error adding ${this.tagName} to ${parentAsAddTarget}`);
                    }
                }

                // try executing attachment if we can
                // (skip if this is a loader to avoid race condition)
                const attachAttribute = this.getAttribute('attach');
                if (!thisIsALoader && attachAttribute) {
                    this.executeAttach(attachAttribute, this.instance);
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
            const split = buildNestedPropertyArray(targetCase);

            // ignore Lunchbox-specific attributes
            if (IGNORED_ATTRIBUTES.includes(targetCase) || IGNORED_ATTRIBUTES.includes(split[0])) {
                return;
            }

            // handle non-events
            // ==================
            // TODO: parse objects as non-JSON (`{&quot;test&quot;: 1}` is annoying to write)
            let parsedValue = parseAttributeValue(value, this);
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

        executeAttach(targetProperty: string, toAttach: unknown): void {
            const parent = this.parentElement as ThreeBase;
            if (parent.instance) {
                setThreeProperty(parent.instance, buildNestedPropertyArray(targetProperty), toAttach);
            }
        }

        disconnectedCallback(): void {
            super.disconnectedCallback();

            const toDispose = [this.instance, this.loaded];
            toDispose.forEach(target => {
                if (!target) return;

                const instanceAsDisposable = target as { dispose?: () => void };
                const instanceAsRemovableFromParent = target as { removeFromParent?: () => void };

                instanceAsDisposable.dispose?.();
                instanceAsRemovableFromParent.removeFromParent?.();
            });

        }

        /** Render */
        render() {
            return html`<slot></slot>`;
        }
    }
    return ThreeBase;
};

