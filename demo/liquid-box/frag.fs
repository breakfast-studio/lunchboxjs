varying float intensity;

void main() {
    vec3 color = vec3(intensity, 0.2, 0.2);
    gl_FragColor = vec4(color, 1.0);
}