import * as THREE from "three";

export const heatmapVertex = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const heatmapFragment = `
uniform float uTime;
uniform vec3 uColor1; // azul intenso
uniform vec3 uColor2; // verde
uniform vec3 uColor3; // amarillo
uniform vec3 uColor4; // rojo
varying vec2 vUv;

vec3 getHeatColor(float value) {
    vec3 color;
    if (value < 0.33) {
        color = mix(uColor1, uColor2, value * 3.0);
    } else if (value < 0.66) {
        color = mix(uColor2, uColor3, (value - 0.33) * 3.0);
    } else {
        color = mix(uColor3, uColor4, (value - 0.66) * 3.0);
    }
    return color;
}

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    // Efecto de onda suave
    float wave = sin(dist * 10.0 - uTime) * 0.5 + 0.5;
    
    // Intensidad basada en la distancia al centro
    float intensity = 1.0 - smoothstep(0.0, 0.8, dist);
    
    // Combina onda y distancia
    float value = mix(intensity, wave, 0.2);
    
    vec3 color = getHeatColor(value);
    
    gl_FragColor = vec4(color, 0.85);
}
`;