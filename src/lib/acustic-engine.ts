// lib/acoustic-engine.ts

import { acousticMaterials } from "@/data/materials";

export type AcousticPoint = {
  id: string;
  x: number;
  y: number;
  z: number;
  db: number;
};

export type AnalysisOptions = {
  mode?: 'day' | 'night';
  thresholdNormal?: number; // límite aceptable en modo diurno
  thresholdHigh?: number;   // límite crítico
};

/**
 * Devuelve el color basado en los niveles de decibelios.
 */
export function getColorByDecibel(db: number): string {
  if (db < 40) return '#1a9850';      // verde (bueno)
  if (db < 60) return '#fee08b';      // amarillo (medio)
  if (db < 80) return '#fc8d59';      // naranja (alto)
  return '#d73027';                   // rojo (crítico)
}

/**
 * Evalúa los puntos acústicos y genera recomendaciones.
 */
export function getRecommendations(
  points: AcousticPoint[],
  options: AnalysisOptions = { mode: 'day' }
): string[] {
  const warnings: string[] = [];
  const { mode = 'day', thresholdNormal, thresholdHigh } = options;

  // Límites de ruido por modo
  const dayThreshold = thresholdNormal ?? 65;
  const highThreshold = thresholdHigh ?? 85;
  const nightAdjustment = mode === 'night' ? -10 : 0;

  const adjustedNormal = dayThreshold + nightAdjustment;
  const adjustedHigh = highThreshold + nightAdjustment;

  points.forEach((p) => {
    if (p.db >= adjustedHigh) {
      warnings.push(`🚨 Punto crítico en (${p.x}, ${p.y}, ${p.z}) con ${p.db} dB. Requiere aislamiento reforzado.`);
    } else if (p.db >= adjustedNormal) {
      warnings.push(`⚠️ Nivel elevado en (${p.x}, ${p.y}, ${p.z}): ${p.db} dB. Evaluar tratamiento acústico.`);
    }
  });

  if (warnings.length === 0) {
    warnings.push('✅ Todos los puntos están dentro de los límites permitidos.');
  }

  return warnings;
}



export function generateExteriorPoints(
  points: AcousticPoint[],
  wallMaterialMap: Record<string, string>
): AcousticPoint[] {
  const spread = 5; // distancia hacia afuera
  const defaultLoss = 20; // pérdida por defecto si no hay material

  const extendedPoints: AcousticPoint[] = [];

  for (const p of points) {
    if (p.db < 10) continue;

    const nearWall = 0.5;

    const directions = [
      { dx: -spread, dz: 0, wall: "left", condition: p.x < nearWall },
      { dx: spread, dz: 0, wall: "right", condition: p.x > 6 - nearWall },
      { dx: 0, dz: -spread, wall: "front", condition: p.z < nearWall },
      { dx: 0, dz: spread, wall: "back", condition: p.z > 6 - nearWall },
      { dx: 0, dz: 0, wall: "top", condition: p.y > 3 - nearWall },
    ];

    for (const dir of directions) {
      if (!dir.condition) continue;

      const materialName = wallMaterialMap[dir.wall];
      const material = acousticMaterials.find((m) => m.name === materialName);
      const loss = material?.absorption ?? defaultLoss;
      const dbOutside = Math.max(p.db - loss, 0);

      extendedPoints.push({
        id: `${p.id}_ext_${dir.wall}`,
        x: p.x + dir.dx,
        y: p.y,
        z: p.z + dir.dz,
        db: dbOutside,
      });
    }
  }

  return extendedPoints;
}


function drawRGBPoints(ctx: CanvasRenderingContext2D, points: AcousticPoint[], width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  points.forEach((p) => {
    const x = ((p.x + width / 2) / width) * ctx.canvas.width;
    const y = ((p.z + height / 2) / height) * ctx.canvas.height;

    const color = getColorFromDb(p.db);

    // Tamaño proporcional al db
    const radius = 3 + (p.db / 100) * 10; // entre 3 y 13 px aprox

    // Opacidad proporcional
    ctx.beginPath();
    ctx.globalAlpha = Math.min(1, Math.max(0.3, p.db / 100)); // al menos 0.3
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}


function getColorFromDb(db: number): string {
  if (db < 33) return "green";
  else if (db < 66) return "yellow";
  else return "red";
}

function interpolateIDW(points: AcousticPoint[], gridSize: number, range: number, power = 2) {
  const result: AcousticPoint[] = [];

  for (let x = -range; x <= range; x += gridSize) {
    for (let z = -range; z <= range; z += gridSize) {
      let numerator = 0;
      let denominator = 0;

      for (const p of points) {
        const dx = x - p.x;
        const dz = z - p.z;
        const distance = Math.sqrt(dx * dx + dz * dz) || 0.0001; // evitar división por 0

        const weight = 1 / Math.pow(distance, power);

        numerator += weight * p.db;
        denominator += weight;
      }

      const interpolatedDb = numerator / denominator;

      result.push({
        id: `interp_${x}_${z}`,
        x,
        y: 0,
        z,
        db: interpolatedDb,
      });
    }
  }

  return result;
}

//Atenuación por distancia (espacio libre):
export function attenuationFreeField(db: number, distance: number): number {
  return db - 20 * Math.log10(distance);
}

// absorptivity = 0 (total rebote), 1 (absorbe todo)
export function absorbByMaterial(db: number, absorptivity: number): number {
  return db * (1 - absorptivity);
}
