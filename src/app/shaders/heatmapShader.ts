import * as THREE from "three";

export const heatmapVertex = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const heatmapFragment = `
uniform sampler2D uData;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform vec3 uColor4;
varying vec2 vUv;

vec3 getHeatColor(float value) {
    vec3 color;
    if (value < 0.4) { // < 60dB
        color = mix(uColor1, uColor2, value * 2.5);
    } else if (value < 0.6) { // 60-70dB
        color = mix(uColor2, uColor3, (value - 0.4) * 5.0);
    } else if (value < 0.8) { // 70-80dB
        color = mix(uColor3, uColor4, (value - 0.6) * 5.0);
    } else { // > 80dB
        color = uColor4;
    }
    return color;
}

void main() {
    vec2 center = vec2(0.5, 0.5);
    float dist = distance(vUv, center);
    
    float intensity = 1.0 - smoothstep(0.0, 0.8, dist);
    float wave = sin(dist * 10.0) * 0.5 + 0.5;
    
    float value = mix(intensity, wave, 0.2);
    vec3 color = getHeatColor(value);
    
    gl_FragColor = vec4(color, 0.85);
}
`;