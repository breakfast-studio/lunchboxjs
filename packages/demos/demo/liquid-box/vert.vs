varying vec2 vUv;
uniform float time;
varying vec3 vNormal;
varying float intensity;

void main() {
    vUv = uv;
    vNormal = normal;

    vec3 extrude = normal * 0.1;

    float t = time + normal.x * 0.5 + normal.y + normal.z * 1.5;  //+ normSequence.x + (normSequence.y + 1.) + normSequence.z + 2.;

    float rippleWidth = 0.4;
    float rippleCenter = 1. - abs(sin(t * 0.5) * 0.9);
    float halfWidth = rippleWidth * 0.5;

    intensity = (1. - distance(vUv, vec2(0.5, 0.5)) * 2.);
    intensity = smoothstep(rippleCenter - halfWidth, rippleCenter, intensity) - smoothstep(rippleCenter, rippleCenter + halfWidth, intensity);

    // adjust uv to (0.5, 0.5)..(0.5, 0.5), where center is (0,0)
    vec2 adj = abs(vUv - vec2(0.5));

    // fade out near edges
    // lower = fade out closer to center, higher = closer to edges
    float innerBound = 0.96;
    float edgeAdjust = 1. - smoothstep(innerBound * 0.5, 0.5, max(adj.x, adj.y));

    intensity *= edgeAdjust;

    vec3 newPos = mix(position, position + extrude, intensity);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);;
}