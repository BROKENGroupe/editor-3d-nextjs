import { useMemo } from "react";
import HeatmapPlane, { AcousticPoint } from "./HeatmapPlane";
import { generateIDWTexture } from "@/lib/idwTexture";
import initialpoints from "../../data/points-dummy.json";
type Props = {
  width: number;
  height: number;
  depth: number;
  points: AcousticPoint[];
};

export function HeatmapSurfaces({ width, height, depth, points = [] }: Props) {
  const fade = (db: number, factor: number) => Math.max(0, db * factor);

  // Superficies internas
  const textureXY = useMemo(
    () => generateIDWTexture(points, 256, 256),
    [points]
  );

  const textureXZ = useMemo(
    () =>
      generateIDWTexture(
        points.map((p) => ({ ...p, y: p.z })),
        256,
        256
      ),
    [points]
  );

  const textureYZ = useMemo(
    () =>
      generateIDWTexture(
        points.map((p) => ({
          id: p.id,
          x: p.z,
          y: p.y,
          z: p.x,
          db: p.db,
        })),
        256,
        256
      ),
    [points]
  );

  // 🔸 Solo proyectamos los puntos hacia el piso exterior
  const projectedFloor = useMemo(() => {
    return (
      points.map((p) => ({
        ...p,
        y: 0,
        db: p.db,
      })),
      256,
      256
    );
  }, [points]);

  
  // 🔸 Generamos textura del piso exterior extendido
  
   const extTextureXY = useMemo(
    () =>
      generateIDWTexture(
        points.map((p) => ({
          id: p.id,
          x: p.z,
          y: p.y,
          z: p.x,
          db: p.db,
        })),
        256,
        256
      ),
    [points]
  );

  return (
    <>
      {/* 🔹 Planos internos */}
      <HeatmapPlane
        width={width}
        height={depth}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        texture={textureXY}
        points={[]}
      />

      <HeatmapPlane
        width={depth}
        height={height}
        position={[-width / 2, height / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        texture={textureYZ}
        points={[]}
      />

      <HeatmapPlane
        width={width}
        height={height}
        position={[0, height / 2, -depth / 2]}
        rotation={[0, 0, 0]}
        texture={textureXZ}
        points={[]}
      />

      {/* 🟢 Piso exterior extendido */}
      <HeatmapPlane
        width={64}
        height={64}
        position={[0, -0.01, 0]} // un poco debajo del piso interior
        rotation={[-Math.PI / 2, 0, 0]}
        texture={extTextureXY}
        points={[]}
      />
    </>
  );
}
