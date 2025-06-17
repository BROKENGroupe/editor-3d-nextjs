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
