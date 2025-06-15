// // components/HeatmapPlane.tsx

// import * as THREE from "three";
// import { useEffect, useRef } from "react";
// import simpleheat from "simpleheat";
// import { Mesh } from "three";

// export type AcousticPoint = {
//   x: number;
//   y: number;
//   z: number;
//   db: number;
// };

// type Props = {
//   width: number;
//   height: number;
//   points: AcousticPoint[];
//   position?: [number, number, number];
//   rotation?: [number, number, number];
//   axisMap?: ['x' | 'y' | 'z', 'x' | 'y' | 'z'];
//   useRGBScale?: boolean;
//   texture?: THREE.Texture;
// };

// const HeatmapPlane = ({
//   width,
//   height,
//   points,
//   position = [0, 0.01, 0],
//   rotation = [-Math.PI / 2, 0, 0],
//   axisMap = ["x", "z"],
//   useRGBScale = false,
// }: Props) => {
//   const meshRef = useRef<Mesh>(null);

//   useEffect(() => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 512;
//     canvas.height = 512;
//     const ctx = canvas.getContext("2d");
//     if (!ctx) return;

//     const [axis1, axis2] = axisMap;

//     if (useRGBScale) {
//       // Modo RGB visual
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//       points.forEach((p) => {
//         const x = ((p[axis1] + width / 2) / width) * canvas.width;
//         const y = ((p[axis2] + height / 2) / height) * canvas.height;
//         const color = getColorFromDb(p.db);
//         ctx.beginPath();
//         ctx.fillStyle = color;
//         ctx.globalAlpha = Math.min(1, p.db / 100);
//         ctx.arc(x, y, 10, 0, 2 * Math.PI);
//         ctx.fill();
//       });
//       ctx.globalAlpha = 1;
//     } else {
//       // Modo interpolado simpleheat
//       const heat = new simpleheat(canvas);
//       const mapped: [number, number, number][] = points.map((p) => [
//         ((p[axis1] + width / 2) / width) * canvas.width,
//         ((p[axis2] + height / 2) / height) * canvas.height,
//         p.db,
//       ]);
//       heat.data(mapped);
//       heat.max(100);
//       heat.radius(40, 20);
//       heat.draw();
//     }

//     const texture = new THREE.CanvasTexture(canvas);
//     texture.needsUpdate = true;

//     if (meshRef.current) {
//       const material = meshRef.current.material as THREE.MeshBasicMaterial;
//       material.map = texture;
//       material.needsUpdate = true;
//     }
//   }, [points, width, height, axisMap, useRGBScale]);

//   return (
//     <mesh ref={meshRef} position={position} rotation={rotation}>
//       <planeGeometry args={[width, height]} />
//       <meshBasicMaterial transparent side={THREE.DoubleSide} />
//     </mesh>
//   );
// };

// function getColorFromDb(db: number): string {
//   const clamp = (value: number, min: number, max: number) =>
//     Math.max(min, Math.min(max, value));

//   db = clamp(db, 0, 100);

//   if (db <= 50) {
//     // Verde (0) a Amarillo (50)
//     const ratio = db / 50;
//     const r = Math.floor(255 * ratio); // 0 → 255
//     const g = 255;                    // siempre 255
//     const b = 0;
//     return `rgb(${r},${g},${b})`;
//   } else {
//     // Amarillo (50) a Rojo (100)
//     const ratio = (db - 50) / 50;
//     const r = 255;
//     const g = Math.floor(255 * (1 - ratio)); // 255 → 0
//     const b = 0;
//     return `rgb(${r},${g},${b})`;
//   }
// }


// export default HeatmapPlane;
import * as THREE from "three";
import { useEffect, useRef } from "react";
import simpleheat from "simpleheat";
import { Mesh } from "three";

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
  texture?: THREE.Texture; // ← soporte para textura externa
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
}: Props) => {
  const meshRef = useRef<Mesh>(null);

  useEffect(() => {
    if (texture && meshRef.current) {
      // Si se pasa una textura externa, se usa directamente
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.map = texture;
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
      heat.radius(40, 20);
      heat.draw();
    }

    const autoTexture = new THREE.CanvasTexture(canvas);
    autoTexture.needsUpdate = true;

    if (meshRef.current) {
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.map = autoTexture;
      material.needsUpdate = true;
    }
  }, [points, width, height, axisMap, useRGBScale, texture]);

  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial transparent side={THREE.DoubleSide} />
    </mesh>
  );
};

function getColorFromDb(db: number): string {
  const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

  db = clamp(db, 0, 100);

  if (db <= 50) {
    const ratio = db / 50;
    const r = Math.floor(255 * ratio);
    const g = 255;
    const b = 0;
    return `rgb(${r},${g},${b})`;
  } else {
    const ratio = (db - 50) / 50;
    const r = 255;
    const g = Math.floor(255 * (1 - ratio));
    const b = 0;
    return `rgb(${r},${g},${b})`;
  }
}

export default HeatmapPlane;
