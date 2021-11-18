import { h, defineComponent } from 'vue'
// import Gltf from './Gltf'
// import { Lunchbox } from '../types'
import { LunchboxWrapper } from './LunchboxWrapper/LunchboxWrapper'

import { catalogue } from './catalogue'
export { catalogue }

export const lunchboxDomComponentNames = [
    'canvas',
    'div',
    'LunchboxWrapper',
]

// component creation utility
const createComponent = (tag: string) =>
    defineComponent({
        inheritAttrs: false,
        name: tag,
        setup(props, context) {
            return () => h(tag, context.attrs, context.slots?.default?.() || [])
        },
    })

// list of all components to register out of the box
const autoGeneratedComponents = [

    // ThreeJS basics
    'mesh',
    'instancedMesh',
    'scene',
    'sprite',
    'object3D',

    // geometry
    'instancedBufferGeometry',
    'bufferGeometry',
    'boxBufferGeometry',
    'circleBufferGeometry',
    'coneBufferGeometry',
    'cylinderBufferGeometry',
    'dodecahedronBufferGeometry',
    'extrudeBufferGeometry',
    'icosahedronBufferGeometry',
    'latheBufferGeometry',
    'octahedronBufferGeometry',
    'parametricBufferGeometry',
    'planeBufferGeometry',
    'polyhedronBufferGeometry',
    'ringBufferGeometry',
    'shapeBufferGeometry',
    'sphereBufferGeometry',
    'tetrahedronBufferGeometry',
    'textBufferGeometry',
    'torusBufferGeometry',
    'torusKnotBufferGeometry',
    'tubeBufferGeometry',
    'wireframeGeometry',
    'parametricGeometry',
    'tetrahedronGeometry',
    'octahedronGeometry',
    'icosahedronGeometry',
    'dodecahedronGeometry',
    'polyhedronGeometry',
    'tubeGeometry',
    'torusKnotGeometry',
    'torusGeometry',
    // textgeometry has been moved to /examples/jsm/geometries/TextGeometry
    // 'textGeometry',
    'sphereGeometry',
    'ringGeometry',
    'planeGeometry',
    'latheGeometry',
    'shapeGeometry',
    'extrudeGeometry',
    'edgesGeometry',
    'coneGeometry',
    'cylinderGeometry',
    'circleGeometry',
    'boxGeometry',

    // materials
    'material',
    'shadowMaterial',
    'spriteMaterial',
    'rawShaderMaterial',
    'shaderMaterial',
    'pointsMaterial',
    'meshPhysicalMaterial',
    'meshStandardMaterial',
    'meshPhongMaterial',
    'meshToonMaterial',
    'meshNormalMaterial',
    'meshLambertMaterial',
    'meshDepthMaterial',
    'meshDistanceMaterial',
    'meshBasicMaterial',
    'meshMatcapMaterial',
    'lineDashedMaterial',
    'lineBasicMaterial',

    // lights
    'light',
    'spotLightShadow',
    'spotLight',
    'pointLight',
    'rectAreaLight',
    'hemisphereLight',
    'directionalLightShadow',
    'directionalLight',
    'ambientLight',
    'lightShadow',
    'ambientLightProbe',
    'hemisphereLightProbe',
    'lightProbe',

    // textures
    'texture',
    'videoTexture',
    'dataTexture',
    'dataTexture3D',
    'compressedTexture',
    'cubeTexture',
    'canvasTexture',
    'depthTexture',

    // Texture loaders
    'textureLoader',

    // misc
    'group',
    'catmullRomCurve3',
    'points',

    // helpers
    'cameraHelper',

    // cameras
    'camera',
    'perspectiveCamera',
    'orthographicCamera',
    'cubeCamera',
    'arrayCamera',

    // renderers
    'webGLRenderer',
].map(createComponent).reduce((acc, curr) => {
    ; (acc as any)[curr.name] = curr
    return acc
})

export const components = {
    ...autoGeneratedComponents,
    'Lunchbox': LunchboxWrapper,
    // Gltf,
}

// console.log(components, Gltf)

/*
// List copied from r3f
// https://github.com/pmndrs/react-three-fiber/blob/master/packages/fiber/src/three-types.ts

// NOT IMPLEMENTED:
    audioListener: AudioListenerProps
    positionalAudio: PositionalAudioProps

    lOD: LODProps
    skinnedMesh: SkinnedMeshProps
    skeleton: SkeletonProps
    bone: BoneProps
    lineSegments: LineSegmentsProps
    lineLoop: LineLoopProps
    // see `audio`
    // line: LineProps
    immediateRenderObject: ImmediateRenderObjectProps

    // primitive
    primitive: PrimitiveProps

    // helpers
    spotLightHelper: SpotLightHelperProps
    skeletonHelper: SkeletonHelperProps
    pointLightHelper: PointLightHelperProps
    hemisphereLightHelper: HemisphereLightHelperProps
    gridHelper: GridHelperProps
    polarGridHelper: PolarGridHelperProps
    directionalLightHelper: DirectionalLightHelperProps
    boxHelper: BoxHelperProps
    box3Helper: Box3HelperProps
    planeHelper: PlaneHelperProps
    arrowHelper: ArrowHelperProps
    axesHelper: AxesHelperProps


    // misc
    raycaster: RaycasterProps
    vector2: Vector2Props
    vector3: Vector3Props
    vector4: Vector4Props
    euler: EulerProps
    matrix3: Matrix3Props
    matrix4: Matrix4Props
    quaternion: QuaternionProps
    bufferAttribute: BufferAttributeProps
    instancedBufferAttribute: InstancedBufferAttributeProps
    color: ColorProps
    fog: FogProps
    fogExp2: FogExp2Props
    shape: ShapeProps
*/