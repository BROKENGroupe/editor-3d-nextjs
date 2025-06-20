"use client";

import { Canvas } from "@react-three/fiber";
import { CameraControls, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { generateRealisticAcousticPoints } from "@/lib/simulateAcousticPoints";
import { Suspense, useEffect, useState } from "react";
import { SourceControl } from "@/app/editor/source-control";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { HeatmapSurfaces } from "../acustic/HeatmapSurfaces";
import {ContextualMenu} from "./contextual-menu";

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

type AcousticObject = {
  id: string;
  type: "speaker" | "microphone";
  position: [number, number, number];
};

const MATERIALS = [
  { label: "Hormigón", value: "concrete" },
  { label: "Ladrillo", value: "brick" },
  { label: "Madera", value: "wood" },
  { label: "Vidrio", value: "glass" },
  { label: "Panel acústico", value: "acoustic_panel" },
];

function SceneContent({ width, height, depth, wallProps, onSelectWall }: Scene3DProps & {
  wallProps: Record<string, { material: string; absorption: number; color: string }>,
  onSelectWall: (wallId: string, opts?: { contextMenu?: boolean, x?: number, y?: number }) => void
}) {
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
        wallProps={wallProps}
        onSelectWall={onSelectWall}
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
  const [objects, setObjects] = useState<AcousticObject[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; wall: string } | null>(null);
  const [wallProps, setWallProps] = useState<Record<string, { material: string; absorption: number; color: string }>>({});
  const [open, setOpen] = useState(false);

  const addSource = () => {
    setObjects([
      ...objects,
      {
        id: crypto.randomUUID(),
        type: "speaker",
        position: [
          Math.random() * props.width,
          0.4,
          Math.random() * props.depth,
        ],
      },
    ]);
  };

  const addMicrophone = () => {
    setObjects([
      ...objects,
      {
        id: crypto.randomUUID(),
        type: "microphone",
        position: [
          Math.random() * props.width,
          0.2,
          Math.random() * props.depth,
        ],
      },
    ]);
  };

  const handleSelectWall = (
    wall: string,
    opts?: { contextMenu?: boolean; x?: number; y?: number }
  ) => {
    if (opts?.contextMenu) {
      setContextMenu({ x: opts.x!, y: opts.y!, wall });
      setOpen(true);
    }
  };

  const handleAssignMaterial = (material: string) => {
    if (contextMenu) {
      setWallProps((prev) => ({
        ...prev,
        [contextMenu.wall]: {
          ...prev[contextMenu.wall],
          material,
        },
      }));
    }
  };

  const handleAbsorption = (absorption: number) => {
    if (contextMenu) {
      setWallProps((prev) => ({
        ...prev,
        [contextMenu.wall]: {
          ...prev[contextMenu.wall],
          absorption,
        },
      }));
    }
  };

  const handleColor = (color: string) => {
    if (contextMenu) {
      setWallProps((prev) => ({
        ...prev,
        [contextMenu.wall]: {
          ...prev[contextMenu.wall],
          color,
        },
      }));
    }
  };

  useEffect(() => {
    if (!open) setContextMenu(null);
  }, [open]);

  return (
    <>
      <div className="w-full h-[100vh] rounded-lg shadow">
        <Canvas camera={{ position: [30, 10, -30], fov: 35 }} shadows>
          <color attach="background" args={["#f0f0f0"]} />
          <SceneContent
            {...props}
            wallProps={wallProps}
            onSelectWall={handleSelectWall}
          />
        </Canvas>
      </div>
      <ContextualMenu
        open={open}
        contextMenu={contextMenu}
        wallProps={wallProps}
        setOpen={setOpen}
        onAssignMaterial={handleAssignMaterial}
        onAbsorption={handleAbsorption}
        onColor={handleColor}
      />
    </>
  );
}
