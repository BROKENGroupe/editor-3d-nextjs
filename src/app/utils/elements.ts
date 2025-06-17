import { AcousticPoint } from '@/lib/acustic-engine';
import materials from '../../data/materials-dummy.json';

export function generateExteriorPointsWithMaterial(
  points: AcousticPoint[],
  width: number,
  height: number,
  depth: number,
  materialType: keyof typeof materials
): AcousticPoint[] {
  const wallLoss = materials[materialType]?.wallLoss || 25;
  const exterior: AcousticPoint[] = [];
  const margin = 0.5;

  for (const point of points) {
    const dbOutside = Math.max(0, point.db - wallLoss);

    if (point.x < margin) {
      exterior.push({ ...point, x: -0.1, db: dbOutside, id: point.id + '_left' });
    }
    if (point.x > width - margin) {
      exterior.push({ ...point, x: width + 0.1, db: dbOutside, id: point.id + '_right' });
    }
    if (point.z < margin) {
      exterior.push({ ...point, z: -0.1, db: dbOutside, id: point.id + '_front' });
    }
    if (point.z > depth - margin) {
      exterior.push({ ...point, z: depth + 0.1, db: dbOutside, id: point.id + '_back' });
    }
    if (point.y > height - margin) {
      exterior.push({ ...point, y: height + 0.1, db: dbOutside, id: point.id + '_top' });
    }
  }

  return exterior;
}
