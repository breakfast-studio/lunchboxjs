import * as THREE from 'three';

export const autoComponents: Partial<keyof typeof THREE>[] = [
    // ORDER MATTERS HERE!
    // Place the objects most likely to wrap other objects at the beginning of the list.
    'WebGLRenderer',
    'Scene',
    'Group',
    'Object3D',
    'Mesh',
    'BoxGeometry',
    'IcosahedronGeometry',
    'MeshBasicMaterial',
    'PerspectiveCamera',
    'PlaneGeometry',
    'SphereGeometry',
]