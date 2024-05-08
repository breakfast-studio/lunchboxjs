import * as THREE from 'three';

/** All components that will automatically be registered when Lunchbox is initialized. */
export const autoComponents: Partial<keyof typeof THREE>[] = [
    // ORDER MATTERS HERE!
    // Place the objects most likely to wrap other objects at the beginning of the list.

    // Main wrappers
    'WebGLRenderer',
    'Scene',
    'Group',

    // Secondary wrappers (objects, meshes, etc)
    'Object3D',
    'Mesh',
    'Sprite',

    // Tertiary items (individual geometries, materials, etc)
    // Geometries
    'BoxGeometry',
    'BufferGeometry',
    'CircleGeometry',
    'ConeGeometry',
    'CylinderGeometry',
    'DodecahedronGeometry',
    'ExtrudeGeometry',
    'IcosahedronGeometry',
    'InstancedBufferGeometry',
    'LatheGeometry',
    'OctahedronGeometry',
    'PlaneGeometry',
    'PolyhedronGeometry',
    'RingGeometry',
    'ShapeGeometry',
    'SphereGeometry',
    'TetrahedronGeometry',
    'TorusGeometry',
    'TorusKnotGeometry',
    'TubeGeometry',
    'WireframeGeometry',
    // Materials
    'PointsMaterial',
    'ShaderMaterial',
    'ShadowMaterial',
    'SpriteMaterial',
    'MeshToonMaterial',
    'MeshBasicMaterial',
    'MeshDepthMaterial',
    'MeshPhongMaterial',
    'LineBasicMaterial',
    'RawShaderMaterial',
    'MeshMatcapMaterial',
    'MeshNormalMaterial',
    'LineDashedMaterial',
    'MeshLambertMaterial',
    'MeshStandardMaterial',
    'MeshDistanceMaterial',
    'MeshPhysicalMaterial',
    // Lights
    'Light',
    'SpotLight',
    'SpotLightHelper',
    'PointLight',
    'PointLightHelper',
    'AmbientLight',
    'RectAreaLight',
    'HemisphereLight',
    'HemisphereLightHelper',
    'DirectionalLight',
    'DirectionalLightHelper',
    // Cameras
    'CubeCamera',
    'ArrayCamera',
    'StereoCamera',
    'PerspectiveCamera',
    'OrthographicCamera',
    // Textures
    'Texture',
    'CubeTexture',
    'DataTexture',
    'DepthTexture',
    'VideoTexture',
    'CanvasTexture',
    'CompressedTexture',
    // Misc
    'CatmullRomCurve3',
    'Points',
    'Raycaster',
    'CameraHelper',
    'Color',
];