import { useRef, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { heatmapVertex, heatmapFragment } from "../shaders/heatmapShader";

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
  // --- SHADER DEL PLANO EXTERIOR (HEATMAP) ---
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderArgs = useMemo(
    () => ({
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#002266") }, // azul oscuro
        uColor2: { value: new THREE.Color("#00ff00") }, // verde
        uColor3: { value: new THREE.Color("#ffff00") }, // amarillo
        uColor4: { value: new THREE.Color("#ff9900") }, // naranja
        uColor5: { value: new THREE.Color("#ff0000") }, // rojo
      },
      vertexShader: heatmapVertex,
      fragmentShader: heatmapFragment,
      transparent: true,
    }),
    []
  );

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  // --- PAREDES DEL CUBO ---
  type Wall = {
    key: string;
    position: [number, number, number];
    rotation: [number, number, number];
    size: [number, number];
  };

  const WALLS: Wall[] = [
    { key: "floor", position: [width / 2, 0, depth / 2], rotation: [-Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "ceiling", position: [width / 2, height, depth / 2], rotation: [Math.PI / 2, 0, 0], size: [width, depth] },
    { key: "north", position: [width / 2, height / 2, 0], rotation: [0, 0, 0], size: [width, height] },
    { key: "south", position: [width / 2, height / 2, depth], rotation: [0, Math.PI, 0], size: [width, height] },
    { key: "west", position: [0, height / 2, depth / 2], rotation: [0, Math.PI / 2, 0], size: [depth, height] },
    { key: "east", position: [width, height / 2, depth / 2], rotation: [0, -Math.PI / 2, 0], size: [depth, height] },
  ];

  return (
    <>
      {/* Cubo translúcido formado por 6 paredes */}
      {WALLS.map((wall) => (
        <mesh
          key={wall.key}
          position={wall.position}
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
        position={[width / 2, -0.15, depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[width * 3, depth * 3]} />
        <shaderMaterial ref={materialRef} attach="material" {...shaderArgs} />
      </mesh>
    </>
  );
}

