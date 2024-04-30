import * as THREE from 'three';

declare global {
    interface HTMLElementTagNameMap {
        'three-lunchbox': ThreeLunchbox,

        // TODO: these need to provide type hinting for `args` property
        'three-mesh': Lunchbox<THREE.Mesh>,
    }

    interface Lunchbox<T> {
        args: ConstructorParameters<T>
        instance: T
    }
}

export * from './index'