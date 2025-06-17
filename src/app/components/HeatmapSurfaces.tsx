import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { heatmapVertex, heatmapFragment } from "@/shaders/heatmapShader";

type Props = {
  width: number;
  height: number;
  depth: number;
  points?: any[];
  onSelectWall?: (wallId: string) => void;
};

export function HeatmapSurfaces({
  width,
  height,
  depth,
  points = [],
  onSelectWall,
}: Props) {
  // Shader material con colores personalizados
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: heatmapVertex,
      fragmentShader: heatmapFragment,
      uniforms: {
        uTime: { value: 0 },
        uColor1: { value: new THREE.Color("#0000ff") }, // azul intenso
        uColor2: { value: new THREE.Color("#00ff00") }, // verde
        uColor3: { value: new THREE.Color("#ffff00") }, // amarillo
        uColor4: { value: new THREE.Color("#ff0000") }, // rojo
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
    }
  });

  return (
    <>
      {/* Cubo blanco */}
      <mesh position={[width / 2, height / 2, depth / 2]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.95} />
      </mesh>

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
