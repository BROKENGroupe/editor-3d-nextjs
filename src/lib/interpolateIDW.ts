// lib/interpolateIDW.ts

export function interpolateIDW(
  points: { x: number; y: number; db: number }[],
  resolution: number = 100,
  power: number = 2
): { x: number; y: number; value: number }[] {
  const result: { x: number; y: number; value: number }[] = [];

  for (let i = 0; i < resolution; i++) {
    for (let j = 0; j < resolution; j++) {
      const x = (i / resolution) * 10 - 5;
      const y = (j / resolution) * 10 - 5;

      let num = 0;
      let denom = 0;

      for (const p of points) {
        const dx = p.x - x;
        const dy = p.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 0.01) {
          num = p.db;
          denom = 1;
          break;
        }

        const weight = 1 / Math.pow(dist, power);
        num += weight * p.db;
        denom += weight;
      }

      result.push({ x, y, value: num / denom });
    }
  }

  return result;
}
