'use client';

import { useEffect, useRef } from 'react';
import h337 from 'heatmap.js';
import { interpolateIDW } from '@/lib/interpolateIDW';
import { AcousticPoint } from '@/lib/acustic-engine';

export default function HeatmapCanvas({ points }: { points: AcousticPoint[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = 500;
    const height = 500;

    const heatmapInstance = h337.create({
      container: containerRef.current,
      radius: 20,
      maxOpacity: 0.8,
      minOpacity: 0.2,
      blur: 0.85,
      gradient: {
        0.0: 'blue',
        0.5: 'yellow',
        1.0: 'red',
      },
    });

    const data = interpolateIDW(points, 60, 5).map((p) => ({
      x: width / 2 + p.x * 30,
      y: height / 2 + p.y * 30,
      value: p.value,
    }));

    heatmapInstance.setData({
      max: 100,
      min: 0,
      data,
    });
  }, [points]);

  return (
    <div
      ref={containerRef}
      style={{ width: 500, height: 500, position: 'relative' }}
    />
  );
}
