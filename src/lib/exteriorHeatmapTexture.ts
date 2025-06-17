import * as THREE from "three";
import chroma from "chroma-js";
import { AcousticPoint } from "./acustic-engine";

// Escala tipo SONarchitect: azul → cyan → verde → amarillo → rojo
const sonarScale = chroma.scale([
  '#000080', // azul oscuro
  '#0000ff', // azul
  '#00ffff', // cyan
  '#00ff00', // verde
  '#ffff00', // amarillo
  '#ff0000'  // rojo
]).domain([45, 55, 65, 75, 85, 95]);

function interpolateIDWContinuous(
  points: AcousticPoint[],
  width: number,
  height: number,
  areaWidth: number,
  areaDepth: number,
  offsetX: number,
  offsetZ: number,
  power = 2
): number[][] {
  const grid: number[][] = [];
  for (let j = 0; j < height; j++) {
    grid[j] = [];
    for (let i = 0; i < width; i++) {
      const x = offsetX + (i / (width - 1)) * areaWidth;
      const z = offsetZ + (j / (height - 1)) * areaDepth;
      let num = 0, denom = 0;
      for (const p of points) {
        const dx = p.x - x;
        const dz = p.z - z;
        const dist = Math.sqrt(dx * dx + dz * dz) || 0.0001;
        const w = 1 / Math.pow(dist, power);
        num += w * p.db;
        denom += w;
      }
      grid[j][i] = num / denom;
    }
  }
  return grid;
}

export function generateExteriorHeatmapTexture(
  points: AcousticPoint[],
  width = 2048, // Mayor resolución
  height = 2048,
  areaWidth = 16,  // Área más grande
  areaDepth = 16,
  offsetX = -5,
  offsetZ = -5
): THREE.Texture {
  const grid = interpolateIDWContinuous(
    points,
    width,
    height,
    areaWidth,
    areaDepth,
    offsetX,
    offsetZ,
    2
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let j = 0; j < height; j++) {
    for (let i = 0; i < width; i++) {
      const db = grid[j][i];
      const color = sonarScale(db).rgb();
      const idx = (j * width + i) * 4;
      data[idx] = color[0];
      data[idx + 1] = color[1];
      data[idx + 2] = color[2];
      data[idx + 3] = 230; // Más opaco
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

// Ejemplo: crea puntos simulados para un cubo de 6x3x6 metros
const simulatedPoints = [
  // Fugas (zonas rojas) cerca de las paredes
  { id: "fuga1", x: 1, y: 0, z: 0.5, db: 95 },
  { id: "fuga2", x: 5, y: 0, z: 0.5, db: 92 },
  { id: "fuga3", x: 3, y: 0, z: 5.5, db: 90 },
  { id: "fuga4", x: 0.5, y: 0, z: 3, db: 88 },
  { id: "fuga5", x: 5.5, y: 0, z: 3, db: 87 },
  // Puntos normales (zonas verdes/azules)
  { id: "n1", x: 3, y: 0, z: 3, db: 70 },
  { id: "n2", x: 2, y: 0, z: 2, db: 60 },
  { id: "n3", x: 4, y: 0, z: 4, db: 58 },
  { id: "n4", x: 1, y: 0, z: 5, db: 55 },
  { id: "n5", x: 5, y: 0, z: 1, db: 53 },
];