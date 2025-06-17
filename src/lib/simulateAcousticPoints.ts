import { AcousticPoint } from "./acustic-engine";

/**
 * Genera puntos acústicos realistas alrededor de un cubo, simulando fugas en esquinas y bordes.
 */
export function generateRealisticAcousticPoints(
  width: number,
  depth: number,
  nGrid = 20 // Más puntos para mejor interpolación
): AcousticPoint[] {
  const points: AcousticPoint[] = [];
  let id = 0;

  // Fugas intensas en esquinas
  const fugas = [
    { x: 0.5, z: 0.5, db: 95 },
    { x: width - 0.5, z: 0.5, db: 93 },
    { x: 0.5, z: depth - 0.5, db: 92 },
    { x: width - 0.5, z: depth - 0.5, db: 94 },
    // Fugas en bordes
    { x: width / 2, z: 0.3, db: 90 },
    { x: width / 2, z: depth - 0.3, db: 89 },
    { x: 0.3, z: depth / 2, db: 88 },
    { x: width - 0.3, z: depth / 2, db: 87 },
    // Fugas adicionales
    { x: width / 4, z: 0.4, db: 85 },
    { x: (width * 3) / 4, z: depth - 0.4, db: 86 },
  ];

  // Agrega fugas
  fugas.forEach(f =>
    points.push({ id: `fuga${id++}`, x: f.x, y: 0, z: f.z, db: f.db })
  );

  // Puntos normales en cuadrícula
  for (let i = 0; i < nGrid; i++) {
    for (let j = 0; j < nGrid; j++) {
      const x = (i / (nGrid - 1)) * width;
      const z = (j / (nGrid - 1)) * depth;

      // Evita duplicar fugas
      if (
        fugas.some(
          f =>
            Math.abs(f.x - x) < 0.6 &&
            Math.abs(f.z - z) < 0.6
        )
      )
        continue;

      // Calcula distancia al borde más cercano
      const dist = Math.min(
        x,
        width - x,
        z,
        depth - z
      );

      // Decay exponencial desde las paredes
      let db = 45 + 25 * Math.exp(-dist / 2);

      // Añade variación realista
      db += Math.random() * 3 - 1.5;

      points.push({ id: `p${id++}`, x, y: 0, z, db });
    }
  }

  return points;
}