import { defineComponent } from 'vue'

export const App = defineComponent({
    name: 'App',
    setup() {
        return () => (
            <lunchbox cameraPosition={[5, 5, 5]} cameraLook={[0, 0, 0]}>
                {/* Orbit controls  */}
                <orbit autoRotate />

                <mesh>
                    <boxGeometry />
                    <meshBasicMaterial color="dodgerblue" />

                    <mesh scale={1.001}>
                        <boxGeometry />
                        <meshBasicMaterial color="black" wireframe />
                    </mesh>
                </mesh>

                {/* loaded GLTF */}
                <pointLight position-y={5} />
                <ambientLight intensity={0.2} />
                <gltf
                    src="BoomBox.glb"
                    position-y={0.5}
                    position-x={2}
                    scale={100}
                />
            </lunchbox>
        )
    },
})
