import * as THREE from 'three';

interface ThreeComponent<T extends abstract new (...args: any) => T> {
    args: ConstructorParameters<T>
    instance: T
}

declare global {
    interface HTMLElementTagNameMap {
        'three-lunchbox': ThreeLunchbox,
        'three-mesh': ThreeComponent<THREE.Mesh>
    }
}
