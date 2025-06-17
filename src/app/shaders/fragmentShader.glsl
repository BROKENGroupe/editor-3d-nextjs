precision mediump float;

uniform vec3 points[10];
uniform float dbValues[10];
uniform int numPoints;
uniform float minDb;
uniform float maxDb;
uniform float opacity;

varying vec2 vUv;

float dbToIntensity(float db) {
  return clamp((db - minDb) / (maxDb - minDb), 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  vec2 fragPos = uv * 2.0 - 1.0; // de 0-1 a -1 a 1
  float intensity = 0.0;

  for (int i = 0; i < 10; i++) {
    if (i >= numPoints) break;

    vec2 p = points[i].xy;
    float db = dbValues[i];
    float dist = distance(fragPos, p);
    float weight = exp(-dist * 10.0); // controla el radio
    intensity += dbToIntensity(db) * weight;
  }

  intensity = clamp(intensity, 0.0, 1.0);
  vec3 color = mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), intensity); // verde → rojo

  gl_FragColor = vec4(color, opacity * intensity);
}
