

// 'use client';

// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import * as THREE from 'three';
// import { HeatmapSurfaces } from './HeatmapSurfaces';

// export type AcousticPoint = {
//   id: string;
//   x: number;
//   y: number;
//   z: number;
//   db: number;
// };

// type Scene3DProps = {
//   width: number;
//   height: number;
//   depth: number;
//   points?: AcousticPoint[];
//   exteriorPoints?: AcousticPoint[];
// };

// function getHeatColor(db: number): THREE.Color {
//   const min = 30;
//   const max = 100;
//   const t = Math.min(1, Math.max(0, (db - min) / (max - min)));
//   const color = new THREE.Color();
//   color.setHSL((1 - t) * 0.7, 1, 0.5);
//   return color;
// }

// function SceneContent({
//   width,
//   height,
//   depth,
//   points = [],
//   exteriorPoints,
// }: Scene3DProps) {
//   return (
//     <>
//       <ambientLight intensity={0.8} />
//       <directionalLight position={[10, 10, 10]} intensity={0.6} />

//       {/* Cubo wireframe */}
//       <mesh position={[0, height / 2, 0]}>
//         <boxGeometry args={[width, height, depth]} />
//         <meshStandardMaterial color="#0077ff" wireframe />
//       </mesh>

//       {/* Esferas por punto acústico */}
//       {points.map((point) => (
//         <mesh key={point.id} position={[point.x, point.y, point.z]}>
//           <sphereGeometry args={[0.1, 16, 16]} />
//           <meshStandardMaterial color={getHeatColor(point.db)} />
//         </mesh>
//       ))}

//       {/* Mapas de calor */}
//       <HeatmapSurfaces
//         width={width}
//         height={height}
//         depth={depth}
//         points={points}
//       />

//       <OrbitControls />
//     </>
//   );
// }

// export default function Scene3D(props: Scene3DProps) {
//   return (
//     <div className="w-full h-[80vh] rounded-lg shadow">
//       <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
//         <SceneContent {...props} />
//       </Canvas>
//     </div>
//   );
// }
'use client';

import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { HeatmapSurfaces } from './HeatmapSurfaces';
import { useRef, useState, useEffect } from 'react';

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
  points?: AcousticPoint[];
  exteriorPoints?: AcousticPoint[];
};

function getHeatColor(db: number): THREE.Color {
  const min = 30;
  const max = 100;
  const t = Math.min(1, Math.max(0, (db - min) / (max - min)));
  const color = new THREE.Color();
  color.setHSL((1 - t) * 0.7, 1, 0.5);
  return color;
}

// Crear paredes como planos individuales para interacción
function InteractiveWall({
  position,
  rotation,
  name,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  name: string;
}) {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  const { camera, gl, scene } = useThree();

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const bounds = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -((event.clientY - bounds.top) / bounds.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(meshRef.current!);

      if (intersects.length > 0) {
        setSelected(!selected);
        console.log(`Pared seleccionada: ${name}`);
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    return () => gl.domElement.removeEventListener('click', handleClick);
  }, [camera, gl, name, selected]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[5, 3]} />
      <meshStandardMaterial
        color={selected ? 'red' : hovered ? 'orange' : '#0077ff'}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SceneContent({
  width,
  height,
  depth,
  points = [],
}: Scene3DProps) {
  const wallW = width;
  const wallH = height;
  const wallD = depth;

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={0.6} />

      {/* Paredes interactivas (6 caras) */}
      <InteractiveWall
        name="Pared Frontal"
        position={[0, wallH / 2, wallD / 2]}
        rotation={[0, 0, 0]}
      />
      {/* <InteractiveWall
        name="Pared Trasera"
        position={[0, wallH / 2, -wallD / 2]}
        rotation={[0, Math.PI, 0]}
      /> */}
      {/* <InteractiveWall
        name="Pared Izquierda"
        position={[-wallW / 2, wallH / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
      /> */}
      <InteractiveWall
        name="Pared Derecha"
        position={[wallW / 2, wallH / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      {/* <InteractiveWall
        name="Techo"
        position={[0, wallH, 0]}
        rotation={[Math.PI / 2, 0, 0]}
      /> */}
      <InteractiveWall
        name="Piso"
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />

      {/* Esferas acústicas */}
      {points.map((point) => (
        <mesh key={point.id} position={[point.x, point.y, point.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={getHeatColor(point.db)} />
        </mesh>
      ))}

      {/* Mapas de calor */}
      <HeatmapSurfaces
        width={width}
        height={height}
        depth={depth}
        points={points}
      />

      <OrbitControls />
    </>
  );
}

export default function Scene3D(props: Scene3DProps) {
  return (
    <div className="w-full h-[80vh] rounded-lg shadow">
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }}>
        <SceneContent {...props} />
      </Canvas>
    </div>
  );
}
