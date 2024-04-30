import * as THREE from 'three';

export const autoComponents: Partial<keyof typeof THREE>[] = [
    'WebGLRenderer',
    'PerspectiveCamera',
    'Scene',
    'Mesh',
    'BoxGeometry',
    'MeshBasicMaterial',
    'IcosahedronGeometry',
    'SphereGeometry',
]