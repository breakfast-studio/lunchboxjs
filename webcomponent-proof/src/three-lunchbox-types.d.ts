import * as THREE from 'three';

declare global {
    interface HTMLElementTagNameMap {
        'three-lunchbox': ThreeLunchbox,
        'three-mesh': Lunchbox<THREE.Mesh>
    }

    interface Lunchbox<T> {
        args: ConstructorParameters<T>
        instance: T
    }
}
