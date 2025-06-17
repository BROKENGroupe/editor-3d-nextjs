import * as THREE from "three";
import { useEffect, useRef } from "react";
import simpleheat from "simpleheat";
import { Mesh } from "three";
import chroma from "chroma-js";

export type AcousticPoint = {
  id: any;
  x: number;
  y: number;
  z: number;
  db: number;
};

type Props = {
  width: number;
  height: number;
  points: AcousticPoint[];
  position?: [number, number, number];
  rotation?: [number, number, number];
  axisMap?: ['x' | 'y' | 'z', 'x' | 'y' | 'z'];
  useRGBScale?: boolean;
  texture?: THREE.Texture;
  opacity?: number;
  wallId?: string;
  onSelectWall?: (wallId: string) => void;
};

const HeatmapPlane = ({
  width,
  height,
  points,
  position = [0, 0.01, 0],
  rotation = [-Math.PI / 2, 0, 0],
  axisMap = ["x", "z"],
  useRGBScale = false,
  texture,
  opacity = 0.5,
  wallId,
  onSelectWall,
}: Props) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    const material = meshRef.current?.material as THREE.MeshBasicMaterial;
    if (!material) return;

    if (texture) {
      material.map = texture;
      material.opacity = opacity;
      material.transparent = opacity < 1;
      material.needsUpdate = true;
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [axis1, axis2] = axisMap;

    if (useRGBScale) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p) => {
        const x = ((p[axis1] + width / 2) / width) * canvas.width;
        const y = ((p[axis2] + height / 2) / height) * canvas.height;
        const color = getColorFromDb(p.db);
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.min(1, p.db / 100);
        ctx.arc(x, y, 10, 0, 2 * Math.PI);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    } else {
      const heat = new simpleheat(canvas);
      const mapped: [number, number, number][] = points.map((p) => [
        ((p[axis1] + width / 2) / width) * canvas.width,
        ((p[axis2] + height / 2) / height) * canvas.height,
        p.db,
      ]);
      heat.data(mapped);
      heat.max(100);
      heat.radius(30, 20);
      heat.draw();
    }

    const autoTexture = new THREE.CanvasTexture(canvas);
    autoTexture.needsUpdate = true;

    material.map = autoTexture;
    material.opacity = opacity;
    material.transparent = opacity < 1;
    material.needsUpdate = true;
  }, [points, width, height, axisMap, useRGBScale, texture, opacity]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      name={wallId}
      onClick={() => wallId && onSelectWall?.(wallId)}
    >
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

// 🔸 Escala de color RGB usando chroma.js
const colorScale = chroma.scale(['green', 'yellow', 'red']).domain([0, 100]);

function getColorFromDb(db: number): string {
  const clampedDb = Math.max(0, Math.min(100, db));
  return colorScale(clampedDb).hex();
}

export default HeatmapPlane;
