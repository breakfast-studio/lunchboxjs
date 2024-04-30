import * as THREE from 'three';

export const autoComponents: Partial<keyof typeof THREE>[] = [
    'BoxGeometry',
    'Group',
    'IcosahedronGeometry',
    'Mesh',
    'MeshBasicMaterial',
    'PerspectiveCamera',
    'PlaneGeometry',
    'Scene',
    'SphereGeometry',
    'WebGLRenderer',
]