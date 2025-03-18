import { ThreeLunchbox } from "./three-lunchbox";
import * as THREE from 'three';

const valueShortcuts = {
    '$scene': (element: HTMLElement) => {
        // TODO: allow non-wrapper scene
        const el = element.closest('three-lunchbox') as unknown as ThreeLunchbox | null;
        return el?.three.scene;
    },
    '$camera': (element: HTMLElement) => {
        // TODO: allow non-wrapper camera
        const el = element.closest('three-lunchbox') as unknown as ThreeLunchbox | null;
        return el?.three.camera;
    },
    '$renderer': (element: HTMLElement) => {
        // TODO: allow non-wrapper renderer
        const el = element.closest('three-lunchbox') as unknown as ThreeLunchbox | null;
        return el?.three.renderer;
    },
    '$domElement': (element: HTMLElement) => {
        // TODO: allow non-wrapper dom element
        const el = element.closest('three-lunchbox') as unknown as ThreeLunchbox | null;
        return el?.three.renderer?.domElement;
    },
};

export const parseAttributeOrPropertyValue = (targetValue: unknown, element: HTMLElement) => {
    // leave as-is if this isn't a string
    if (typeof targetValue !== 'string') return targetValue;

    // return `true` for blank values
    if (targetValue === '') return true;

    // look for Lunchbox-specific shortcuts
    // TODO: allow extending these
    const result = valueShortcuts[targetValue as keyof typeof valueShortcuts]?.(element);

    // Color support
    if (CSS.supports('color', targetValue)) return new THREE.Color(targetValue);

    // default - return target value
    return result ?? targetValue;
};