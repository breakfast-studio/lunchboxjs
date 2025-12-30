import { autoComponents } from './auto-components';
import { buildClass } from './three-base';
import { ThreeLunchbox } from './three-lunchbox';
import { IsClass } from './utils';
import * as THREE from '../node_modules/@types/three';
import { HtmlAnchor } from './html-anchor';

export * from './three-lunchbox';
export * from './html-anchor';

/** Every component in a Lunchbox scene is of the Lunchbox type - it contains its ThreeJS instance
 * as a property called `instance`. 
 * 
 * 
 * ## Basic example
 * 
 * HTML:
 * 
 * ```html
 * <three-mesh></three-mesh>
 * ```
 * 
 * TS:
 * 
 * ```ts
 * const mesh = document.querySelector<Lunchbox<THREE.Mesh>>('three-mesh');
 * mesh?.instance; // this is typed as a THREE.Mesh, so you can do things like move it up:
 * mesh?.instance.position.set(0, 1, 0); // - or anything else you can do with a mesh
 * ```
 */
export type Lunchbox<T = THREE.Object3D> = Element & LunchboxProperties<T>

export type LunchboxProperties<T = THREE.Object3D> = {
    instance: T;
}

/** Options for initializing Lunchbox. */
interface LunchboxOptions {
    /** Add THREE class names that should be registered first here. */
    prependList?: string[];
}

/** Initialize Lunchbox. Required to register Lunchbox components. */
export const initLunchbox = ({
    prependList = [],
}: LunchboxOptions = {}) => {
    const toDefine = {
        'three-lunchbox': ThreeLunchbox,
        'html-anchor': HtmlAnchor,
    }

    Object.entries(toDefine).forEach(([k, v]) => {
        if (!customElements.get(k)){
            customElements.define(k, v);
        }
    });

    // define components
    [...prependList, ...autoComponents].forEach(className => {
        const kebabCase = convertThreeClassToWebComponent(className);

        // ignore if already defined
        if (customElements.get(kebabCase)) {
            return;
        }

        const result = buildClass(className as keyof typeof THREE);
        if (result) {
            customElements.define(kebabCase, result);
        }
    });
};

/** Create and register a custom Lunchbox component. For example:
 * 
 * ```ts
 * import { CustomGeometry } from 'your-custom-geometry-source';
 * import { extend } from 'lunchboxjs';
 * 
 * extend('custom-geometry', CustomGeometry);
 * ```
 * 
 * Now in your HTML, you can do:
 * 
 * ```html
 * <three-lunchbox>
 *      <custom-geometry args="[0, 1, 2]"></custom-geometry>
 * </three-lunchbox>
 * ```
 */
export const extend = (name: string, classDefinition: IsClass, targetWindow = window) => {
    if (targetWindow.customElements.get(name)) {
        console.log(`${name} already registered as a custom element. Try a different name if registering is still required.`);
        return;
    }

    const result = buildClass(classDefinition);
    if (result) {
        targetWindow.customElements.define(name, result);
    } else {
        throw new Error(`Could not extend ${name}. The second paramater must be a class.`);
    }
};

// Utilities
// ==================
export const THREE_POINTER_MOVE_EVENT_NAME = 'threepointermove';
export const THREE_MOUSE_MOVE_EVENT_NAME = 'threemousemove';
export const THREE_CLICK_EVENT_NAME = 'threeclick';
export const BEFORE_RENDER_EVENT_NAME = 'beforerender';
export const AFTER_RENDER_EVENT_NAME = 'afterrender';
export type ThreeIntersectEvent = {
    intersect: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>;
    element: Element | null;
}
export interface InstanceEvent<T = unknown> {
    instance: T;
}
export type InstanceAddedEvent<T = unknown> = InstanceEvent<T> & {
    parent: THREE.Scene | THREE.Object3D
}
export interface LoadedEvent<T = unknown> {
    loaded: T;
}

// Components
export { autoComponents };
const convertThreeClassToWebComponent = (className: string) => {
    // convert name to kebab-case; prepend `three-` if needed; `-g-l-` becomes `-gl-`
    let kebabCase = className.split(/\.?(?=[A-Z])/).join('-').toLowerCase().replace(/-g-l-/, '-gl-');
    if (!kebabCase.includes('-')) {
        kebabCase = `three-${kebabCase}`;
    }
    return kebabCase;
};
/** The kebab-cased name of the ThreeJS web components automatically registered in Lunchbox. */
export const webComponentNames = autoComponents.map(convertThreeClassToWebComponent);