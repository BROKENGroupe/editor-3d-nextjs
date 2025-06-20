import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { heatmapVertex, heatmapFragment } from "@/app/shaders/heatmapShader";


type Props = {
  width: number;
  height: number;
  depth: number;
  points?: any[];
  onSelectWall?: (wallId: string, opts?: { contextMenu?: boolean; x?: number; y?: number }) => void;
  wallProps?: Record<string, { material: string; absorption: number; color: string }>;
};

const WALLS = [
  { key: "floor", position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0] as [number, number, number] },
  { key: "ceiling", position: [0, 1, 0], rotation: [Math.PI / 2, 0, 0] as [number, number, number] },
  { key: "north", position: [0, 0.5, -0.5], rotation: [0, 0, 0] as [number, number, number] },
  { key: "south", position: [0, 0.5, 0.5], rotation: [0, Math.PI, 0] as [number, number, number] },
  { key: "west", position: [-0.5, 0.5, 0], rotation: [0, Math.PI / 2, 0] as [number, number, number] },
  { key: "east", position: [0.5, 0.5, 0], rotation: [0, -Math.PI / 2, 0] as [number, number, number] },
].map(wall => ({
  ...wall,
  position: [
    wall.position[0] ?? 0,
    wall.position[1] ?? 0,
    wall.position[2] ?? 0
  ] as [number, number, number],
  rotation: wall.rotation as [number, number, number]
}));

export function HeatmapSurfaces({
  width,
  height,
  depth,
  points = [],
  onSelectWall,
  wallProps = {},
}: Props) {
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: heatmapVertex,
      fragmentShader: heatmapFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#0000ff") }, // < 60dB azul
        uColor2: { value: new THREE.Color("#00ff00") }, // 60-70dB verde
        uColor3: { value: new THREE.Color("#ffff00") }, // 70-80dB amarillo
        uColor4: { value: new THREE.Color("#ff0000") }, // > 80dB rojo
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  // Referencia para animar el shader
  const materialRef = useRef(shaderMaterial);

  //Animación del shader
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime() * 0.5;

      // Actualiza colores basados en puntos cercanos
      const nearPoints = points.filter((p) => Math.abs(p.y) < 1); // Puntos cerca del suelo

      if (nearPoints.length > 0) {
        const maxDb = Math.max(...nearPoints.map((p) => p.db));
        const intensity = (maxDb - 50) / 50; // Normaliza 50-100dB a 0-1
        materialRef.current.uniforms.uIntensity = { value: intensity };
      }
    }
  });

  return (
    <>
      {/* Cubo blanco
      <mesh position={[width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh> */}

      {/* Paredes seleccionables */}
      {WALLS.map((wall) => (
        <mesh
          key={wall.key}
          position={[width / 2, height / 2, depth / 2]}
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
          {/* <planeGeometry
            args={
              wall.key === "floor" || wall.key === "ceiling"
                ? [width, depth]
                : [width, height]
            }
          /> */}<boxGeometry args={[width, height, depth]} />


          <meshStandardMaterial
            color={wallProps[wall.key]?.color ?? "#e0e0e0"}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}

      {/* Plano exterior con shader */}
      <mesh
        position={[width / 2, -0.15, depth / 2]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[width * 3, depth * 3]} />
        <primitive object={materialRef.current} attach="material" />
      </mesh>
    </>
  );
}

