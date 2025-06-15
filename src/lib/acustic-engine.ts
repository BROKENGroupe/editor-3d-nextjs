// lib/acoustic-engine.ts

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

export function generateExteriorPoints(points: AcousticPoint[]): AcousticPoint[] {
  const spread = 5; // qué tanto se propaga el sonido
  const factor = 0.3; // cuánta intensidad queda

  const extendedPoints: AcousticPoint[] = [];

  for (const p of points) {
    if (p.db < 10) continue;

    // Crea 8 puntos alrededor del original
    const directions = [
      [spread, 0], [-spread, 0],
      [0, spread], [0, -spread],
      [spread, spread], [spread, -spread],
      [-spread, spread], [-spread, -spread],
    ];

    for (const [dx, dz] of directions) {
      extendedPoints.push({
        id: `${p.id}_ext_${dx}_${dz}`,
        x: p.x + dx,
        y: 0,
        z: p.z + dz,
        db: Math.max(p.db * factor, 0),
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
