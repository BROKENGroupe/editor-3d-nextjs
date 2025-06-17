const fragmentShader = `
  uniform vec3 points[100];
  uniform float dbValues[100];
  uniform int numPoints;
  uniform float minDb;
  uniform float maxDb;
  varying vec2 vUv;

  float gaussian(float x, float sigma) {
    return exp(-0.5 * (x * x) / (sigma * sigma));
  }

  vec3 getColorFromDb(float db) {
    float norm = clamp((db - minDb) / (maxDb - minDb), 0.0, 1.0);
    if (norm < 0.5) {
      return mix(vec3(0.0, 1.0, 0.0), vec3(1.0, 1.0, 0.0), norm * 2.0); // verde → amarillo
    } else {
      return mix(vec3(1.0, 1.0, 0.0), vec3(1.0, 0.0, 0.0), (norm - 0.5) * 2.0); // amarillo → rojo
    }
  }

  void main() {
    vec2 fragPos = vUv;
    float intensity = 0.0;

    for (int i = 0; i < 100; i++) {
      if (i >= numPoints) break;

      vec2 pt = points[i].xy;
      float dist = distance(fragPos, pt);
      float contribution = gaussian(dist, 0.1) * dbValues[i];
      intensity += contribution;
    }

    vec3 color = getColorFromDb(intensity);
    gl_FragColor = vec4(color, intensity > 0.0 ? 1.0 : 0.0);
  }
`;

export default fragmentShader;
