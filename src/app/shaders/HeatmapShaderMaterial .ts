import { shaderMaterial } from "@react-three/drei";
import * as THREE from "three";
import vertexShader from "../utils/vertexShader";
import fragmentShader from "../utils/fragmentShader";
import { ReactThreeFiber } from "@react-three/fiber";

const HeatmapShaderMaterial = shaderMaterial(
  {
    points: Array(10).fill(new THREE.Vector3()), // hasta 10 puntos
    dbValues: new Float32Array(10), // hasta 10 dB
    numPoints: 0,
    minDb: 30,
    maxDb: 100,
    opacity: 0.9,
  },
  vertexShader,
  fragmentShader
);

export { HeatmapShaderMaterial };

