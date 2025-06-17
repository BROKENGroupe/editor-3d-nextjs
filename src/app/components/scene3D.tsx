"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { HeatmapSurfaces } from "./HeatmapSurfaces";
import { generateRealisticAcousticPoints } from "@/lib/simulateAcousticPoints";
import { Suspense } from "react";

export type AcousticPoint = {
  id: string;
  x: number;
  y: number;
  z: number;
  db: number;
};

type Scene3DProps = {
  width: number;
  height: number;
  depth: number;
};

function getHeatColor(db: number): THREE.Color {
  const min = 50;
  const max = 100;
  const t = Math.min(1, Math.max(0, (db - min) / (max - min)));
  const color = new THREE.Color();
  color.setHSL((1 - t) * 0.7, 1, 0.5);
  return color;
}

function SceneContent({ width, height, depth }: Scene3DProps) {
  const points = generateRealisticAcousticPoints(width, depth, 16);

  return (
    <>
      <ambientLight intensity={1.0} />
      <directionalLight
        position={[13, 5, 5]}
        castShadow
        intensity={2.5}
        shadow-mapSize={[1024, 1024]}
      >
        <orthographicCamera
          attach="shadow-camera"
          left={-30}
          right={30}
          top={30}
          bottom={-30}
        />
      </directionalLight>

      {points.map((point) => (
        <mesh key={point.id} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={getHeatColor(point.db)} />
        </mesh>
      ))}

      <HeatmapSurfaces
        width={width}
        height={height}
        depth={depth}
        points={points}
        onSelectWall={(wallId) => {
          console.log("Seleccionaste:", wallId);
        }}
      />

      <CameraControls
        maxPolarAngle={Math.PI / 2.2}
        maxDistance={80}
        minDistance={15}
      />
    </>
  );
}

export default function Scene3D(props: Scene3DProps) {
  return (
    <Suspense>
      <div className="w-full h-[80vh] rounded-lg shadow">
        <Canvas camera={{ position: [30, 10, -30], fov: 35 }} shadows>
          <color attach="background" args={["#f0f0f0"]} />
          <SceneContent {...props} />
        </Canvas>
      </div>
    </Suspense>
  );
}
