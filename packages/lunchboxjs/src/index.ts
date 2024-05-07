import { autoComponents } from './auto-components';
import { buildClass } from './three-base';
import { ThreeLunchbox } from './three-lunchbox';
import { IsClass } from './utils';
import * as THREE from '../node_modules/@types/three';

export * from './three-lunchbox';

export const THREE_POINTER_MOVE_EVENT_NAME = 'threepointermove';

interface LunchboxOptions {
    /** Add THREE class names that should be registered first here. */
    prependList?: string[];
}

export const initLunchbox = ({
    prependList = [],
}: LunchboxOptions = {}) => {
    customElements.define('three-lunchbox', ThreeLunchbox);

    [...prependList, ...autoComponents].forEach(className => {
        // convert name to kebab-case; prepend `three-` if needed
        let kebabCase = className.split(/\.?(?=[A-Z])/).join('-').toLowerCase().replace(/-g-l-/, '-gl-');
        if (!kebabCase.includes('-')) {
            kebabCase = `three-${kebabCase}`;
        }


        const result = buildClass(className as keyof typeof THREE);
        if (result) {
            customElements.define(kebabCase, result);
        }
    });
};

export const extend = (name: string, classDefinition: IsClass) => {
    const result = buildClass(classDefinition);
    if (result) {
        customElements.define(name, result);
    }
};

export type ThreePointerMoveEvent = {
    intersect: THREE.Intersection<THREE.Object3D<THREE.Object3DEventMap>>;
    element: Element | null;
}