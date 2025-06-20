import { useRef, useMemo } from "react";
import * as THREE from "three";
import { heatmapVertex, heatmapFragment } from "../shaders/heatmapShader";
import { calculateSPL } from "@/lib/spl";

type Props = {
  width: number;
  height: number;
  depth: number;
  points?: any[];
  onSelectWall?: (wallId: string, opts?: { contextMenu?: boolean; x?: number; y?: number }) => void;
  wallProps?: Record<string, { material: string; absorption: number; color: string }>;
};

export function HeatmapSurfaces({
  width,
  height,
  depth,
  points = [],
  onSelectWall,
  wallProps = {},
}: Props) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Paredes del cubo
  const WALLS = [
    { key: "floor", position: [width / 2, 0, depth / 2], rotation: [-Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "ceiling", position: [width / 2, height, depth / 2], rotation: [Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "north", position: [width / 2, height / 2, 0], rotation: [0, 0, 0], size: [width, height] },
    { key: "south", position: [width / 2, height / 2, depth], rotation: [0, Math.PI, 0], size: [width, height] },
    { key: "west", position: [0, height / 2, depth / 2], rotation: [0, Math.PI / 2, 0], size: [depth, height] },
    { key: "east", position: [width, height / 2, depth / 2], rotation: [0, -Math.PI / 2, 0], size: [depth, height] },
  ] as const;

  // Parámetros para el plano exterior y la fuga localizada
  const heatmapSegments = 48;
  const extWidth = width * 3;
  const extDepth = depth * 3;
  const minSPL = 40;
  const maxSPL = 105;
  const fugaWidth = width * 0.18; // ancho de la fuga (puerta)
  const fugaHeight = depth * 0.25; // alto de la fuga (puerta)
  const fugaOffsetX = (extWidth + width) / 2; // posición de la cara east
  const fugaOffsetZ = extDepth / 2; // centro de la cara east

  const heatmapPoints = useMemo(() => {
    const arr: { x: number; z: number; spl: number }[] = [];
    for (let ix = 0; ix < heatmapSegments; ix++) {
      for (let iz = 0; iz < heatmapSegments; iz++) {
        const x = (ix / (heatmapSegments - 1)) * extWidth;
        const z = (iz / (heatmapSegments - 1)) * extDepth;
        // ¿Está dentro del cubo?
        const inside =
          x > (extWidth - width) / 2 &&
          x < (extWidth + width) / 2 &&
          z > (extDepth - depth) / 2 &&
          z < (extDepth + depth) / 2;

        // SPL bajo dentro, alto fuera
        let spl = inside
          ? minSPL + Math.random() * 3
          : maxSPL - Math.random() * 10;

        // Fuga localizada: simula una puerta en la cara east (centro de la cara)
        const isFuga =
          !inside &&
          x > fugaOffsetX - fugaWidth / 2 &&
          x < fugaOffsetX + fugaWidth / 2 &&
          z > fugaOffsetZ - fugaHeight / 2 &&
          z < fugaOffsetZ + fugaHeight / 2;

        if (isFuga) {
          // SPL máximo en la fuga y gradiente hacia afuera
          const distFuga = Math.sqrt(
            ((x - fugaOffsetX) / (fugaWidth / 2)) ** 2 +
            ((z - fugaOffsetZ) / (fugaHeight / 2)) ** 2
          );
          spl = maxSPL - distFuga * 30 + Math.random() * 2;
          if (spl > maxSPL) spl = maxSPL;
        }

        arr.push({ x, z, spl });
      }
    }
    return arr;
  }, [width, depth]);

  // Normaliza SPL para el shader
  const splVals = heatmapPoints.map((p) => p.spl);
  const minSPLv = Math.min(...splVals);
  const maxSPLv = Math.max(...splVals);
  const normalized = splVals.map((v) => (v - minSPLv) / (maxSPLv - minSPLv));
  const data = new Float32Array(normalized);
  const dataTexture = useMemo(() => {
    const tex = new THREE.DataTexture(
      data,
      heatmapSegments,
      heatmapSegments,
      THREE.RedFormat,
      THREE.FloatType
    );
    tex.needsUpdate = true;
    return tex;
  }, [data, heatmapSegments]);

  // Puntos SPL simulados (opcional, para visualización)
  const splPoints = useMemo(() => {
    const pointsArr: { x: number; y: number; z: number; spl: number }[] = [];
    const gridX = 12;
    const gridZ = 12;
    const src = { x: width / 2, y: 1.5, z: depth / 2, Lw: 85, Q: 1, alpha: 0.01 };
    for (let ix = 0; ix < gridX; ix++) {
      for (let iz = 0; iz < gridZ; iz++) {
        const x = (ix / (gridX - 1)) * width;
        const z = (iz / (gridZ - 1)) * depth;
        const r = Math.sqrt((x - src.x) ** 2 + (0 - src.y) ** 2 + (z - src.z) ** 2);
        const spl = calculateSPL(src.Lw, src.Q, Math.max(r, 0.5), src.alpha);
        pointsArr.push({ x, y: 0.02, z, spl });
      }
    }
    return pointsArr;
  }, [width, depth]);

  // Colores realistas para mapa de calor acústico
  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uColor1: { value: new THREE.Color("#002266") }, // azul oscuro
        uColor2: { value: new THREE.Color("#00ff00") }, // verde
        uColor3: { value: new THREE.Color("#ffff00") }, // amarillo
        uColor4: { value: new THREE.Color("#ff9900") }, // naranja
        uColor5: { value: new THREE.Color("#ff0000") }, // rojo
        uData: { value: dataTexture },
      },
      vertexShader: heatmapVertex,
      fragmentShader: heatmapFragment,
      transparent: true,
    }),
    [dataTexture]
  );

  return (
    <>
      {/* Cubo translúcido centrado */}
      {WALLS.map((wall) => (
        <mesh
          key={wall.key}
          position={[
            wall.position[0] + (extWidth - width) / 2,
            wall.position[1],
            wall.position[2] + (extDepth - depth) / 2,
          ]}
          rotation={wall.rotation}
          onClick={(e) => {
            e.stopPropagation();
            onSelectWall?.(wall.key);
          }}
          onContextMenu={(e) => {
            e.stopPropagation();
            e.nativeEvent.preventDefault();
            onSelectWall?.(wall.key, { contextMenu: true, x: e.clientX, y: e.clientY });
          }}
        >
          <planeGeometry args={wall.size} />
          <meshStandardMaterial
            color={wallProps?.[wall.key]?.color ?? "#a78bfa"}
            transparent
            opacity={0.4}
            side={2}
          />
        </mesh>
      ))}

      {/* Plano exterior con shader (heatmap) */}
      <mesh
        position={[extWidth / 2, -0.15, extDepth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[extWidth, extDepth, heatmapSegments - 1, heatmapSegments - 1]} />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          {...shaderArgs}
        />
      </mesh>

      {/* Puntos SPL simulados dentro del cubo */}
      {splPoints.map((pt, i) => (
        <mesh key={i} position={[
          pt.x + (1.5 * width - width) / 2,
          pt.y,
          pt.z + (1.5 * depth - depth) / 2
        ]}>
          <sphereGeometry args={[0.07, 8, 8]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      ))}
    </>
  );
}

